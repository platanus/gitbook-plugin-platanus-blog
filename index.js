var request = require('request');
var Q = require('q');
var moment = require('moment');
var _ = require('lodash');

function getHeader(tags){
  return "<h2>Post en Codigo Banana</h2>";
}

function getTagHeader(tag){
  return "<h5>" + tag + "</h5>";
}

function getPostLink(post){
  var date = new Date(post.date);
  var momentDate = moment(date);

  return "<li>" +
           "<a href='" + post.url + "'>" + post.title + "</a> <i>(" + momentDate.fromNow() + ")</i>" +
         "</li>";
}
var ca = 0;
function getNoPosts(tag){
  return "<p><i>No hay blog posts relacionados</i></p>";
}

function combinations(set) {
  return (function acc(xs, set) {
    var x = xs[0];
    if(typeof x === "undefined")
      return set;
    for(var i = 0, l = set.length; i < l; ++i)
      set.push(set[i].concat(x));
    return acc(xs.slice(1), set);
  })(set, [[]]).slice(1);
}

function combinePosts(combinedTags, data){
  var combinedPosts = {};
  var usedPosts = [];

  var byPost = _.reduce(data, function(memo, posts, key){
    _.each(posts, function(post){
      if(memo[post.url] === undefined){
        memo[post.url] = {};
      }
      memo[post.url].post = post;

      if(memo[post.url].tags === undefined){
        memo[post.url].tags = [];
      }
      memo[post.url].tags.push(key);
    });
    return memo;
  }, {});

  _.each(byPost, function(obj){

    _.each(combinedTags, function(tags){
      var t = _.intersection(tags, obj.tags);
      var tagKey = t.join(", ");

      if(tagKey){
        if(_.indexOf(usedPosts, obj.post.url) === -1){
          combinedPosts[tagKey] = combinedPosts[tagKey] || [];
          combinedPosts[tagKey].push(obj.post);
          usedPosts.push(obj.post.url);
        }
      }
    });
  });

  return combinedPosts;
}

module.exports = {
  hooks: {
		"init": function (a,b) {
      var pluginsConfig = this.options.pluginsConfig.platanusBlog;
      var url = pluginsConfig.url;

      var variables = this.config.options.variables;
      var deferred = Q.defer();

      request({ url: url, json: true }, function(error, res, body) {
        variables.tags = body;
        deferred.resolve();
      });

      // return deferred.promise;
      return deferred.promise;
    },
  },
  blocks: {
      getPostsByTag: {
          process: function(block) {
            var ctx = this.ctx;
            var tagsCombinations = combinations(block.args).reverse();

            var data = ctx.config.variables.tags || {};

            var combinedPosts = combinePosts(tagsCombinations, data);

            // render
            var str = getHeader();

            // if(Object.keys(combinedPosts).length > 0){
            var noPosts = true;
            _.each(combinedPosts, function(_posts, _tags){

              str += getTagHeader(_tags);
              str += "<ul>";

              _.each(_posts, function(_post){
                noPosts = false;
                str += getPostLink(_post);
              });

              str += "</ul>";
            });
            // }
            if(noPosts){
              str += getNoPosts();
            }
            
            return str;
          }
      }
  }
};

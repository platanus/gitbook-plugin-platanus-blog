var http = require('http');
var Q = require('q');
var moment = require('moment');

function getHeader(tags){
  return "<h2>Post en Codigo Banana</h2>"
}

function getTagHeader(tag){
  return "<h5>" + tag + "</h5>"
}

function getPostLink(post){
  var date = new Date(post.date);
  var momentDate = moment(date);

  return "<li>" +
           "<a href='" + post.url + "'>" + post.title + "</a> <i>(" + momentDate.fromNow() + ")</i>" +
         "</li>";
}

module.exports = {
  hooks: {
		"init": function (a,b) {
      var url = "http://localhost:4001/posts-by-tag.json";

      var variables = this.config.options.variables;
      var deferred = Q.defer();
      
      http.get(url, function(res){
        var str = '';

          //another chunk of data has been recieved, so append it to `str`
          res.on('data', function (chunk) {
            str += chunk;
          });

          //the whole response has been recieved, so we just print it out here
          res.on('end', function () {
            variables.tags = JSON.parse(str);
            deferred.resolve();
          });
      });

      // return deferred.promise;
      return deferred.promise;
    },
  },
  blocks: {
      getPostsByTag: {
          process: function(block) {
            var ctx = this.ctx;
            var tags = block.args;
            var postsByTag = ctx.config.variables.tags || {};

            var str = getHeader();
            str += "<ul>";

            tags.forEach(function(tag){
              str += getTagHeader(tag);

              var posts = postsByTag[tag] || [];

              posts.forEach(function(post){
                str += getPostLink(post);
              });
            });

            str += "</ul>";

            return str;
          }
      }
  }
};

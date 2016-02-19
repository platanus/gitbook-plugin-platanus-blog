# Gitbook Plugin Platanus Blog

Very ugly plugin to get posts from our blog and list them inside the
compiled book

## Config

Add the following to the `book.json`

```json
...
"plugins" : ["platanus-blog"],
"pluginsConfig": {
  "platanusBlog": {
    "url": "https://cb.platan.us/posts-by-tag.json"
  }
},
...
```

Where `platanusBlog.url` is the url where we get the posts.

> The blog is a Jekyll compiled static site that use
a plugin to generate a static json file with the posts by tag.
[_plugin/tagsToJson.rb](https://github.com/platanus/blog/blob/master/_plugins/tagsToJson.rb)

## How to use it

Just add the following block where you want to add the list of post. The block receive `n` arguments being the tags you want to filter by.


    {% getPostsByTag 'node', 'ionic' %}{% endgetPostsByTag %}

## Credits

Thank you [contributors](https://github.com/platanus/gitbook-plugin-platanus-blog/graphs/contributors)!

<img src="http://platan.us/gravatar_with_text.png" alt="Platanus" width="250"/>

Gitbook Plugin Platanus Blog is maintained by [platanus](http://platan.us).

## License

La Guia is © 2016 platanus, spa. It is free software and may be redistributed under the terms specified in the LICENSE file.

# ngineer

ngineer is a node utility library that assists with dynamically adding locations to a server configuration by generating suitable [location](http://wiki.nginx.org/HttpCoreModule#location) directives in separate location files that can then be included into a core `nginx.conf` configuration file.

Additionally, ngineer communicates with the `nginx` process and sends the `HUP` [signal](http://wiki.nginx.org/CommandLine#Loading_a_New_Configuration_Using_Signals) to flag the the nginx configuration should be reloaded and nginx gracefully restarted.

Why do you want this?  Well, because `nginx` does a kick arse job of serving static files and also proxying services so it makes sense you use it over pure node alternatives such as [node-http-proxy](https://github.com/nodejitsu/node-http-proxy).  No offense is meant to the awesome [nodejitsu](nodejitsu.com) team here, but I feel much more comfortable using nginx over node to be the first line in serving both node applications and static content.

## Prior Art

- [nginx-http-proxy](https://github.com/liamoehlman/nginx-http-proxy)
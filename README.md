# ngineer

ngineer is a node utility library that assists with dynamically adding
locations to a server configuration by generating suitable
[location](http://wiki.nginx.org/HttpCoreModule#location) directives in
separate location files that can then be included into a core `nginx.conf`
configuration file.

Additionally, ngineer communicates with the `nginx` process and sends the
`HUP` [signal](http://wiki.nginx.org/CommandLine#Loading_a_New_Configuration_Using_Signals)
to flag the the nginx configuration should be reloaded and nginx gracefully restarted.

Why do you want this?  Well, because `nginx` does a kick arse job of serving
static files and also proxying services so it makes sense you use it over
pure node alternatives such as [node-http-proxy](https://github.com/nodejitsu/node-http-proxy).
No offense is meant to the awesome [nodejitsu](nodejitsu.com) team here, but
I feel much more comfortable using nginx over node to be the first line in
serving both node applications and static content.


[![NPM](https://nodei.co/npm/ngineer.png)](https://nodei.co/npm/ngineer/)

[![Dependency Status](https://david-dm.org/DamonOehlman/ngineer.svg)](https://david-dm.org/DamonOehlman/ngineer) 

## Prior Art

- [nginx-http-proxy](https://github.com/liamoehlman/nginx-http-proxy)

## License(s)

### MIT

Copyright (c) 2014 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

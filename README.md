# ngineer

ngineer is a node automation later for nginx that assists with the following:

* scaffolding a new nginx configuration folder (i.e. `conf/`, `html/`, `logs/`)
* starting and reloading nginx using targeted base path
* adding location proxy directives

[![NPM](https://nodei.co/npm/ngineer.png)](https://nodei.co/npm/ngineer/)

[![unstable](https://img.shields.io/badge/stability-unstable-yellowgreen.svg)](https://github.com/dominictarr/stability#unstable) [![Build Status](https://api.travis-ci.org/DamonOehlman/ngineer.svg?branch=master)](https://travis-ci.org/DamonOehlman/ngineer)

## Getting Started

The following example shows how the `ngineer` module can be used to scaffold and start nginx within an application.

```js
const async = require('async');
const nginx = require('ngineer')(__dirname + '/nginx', {
  port: 8080
});

async.series([
  nginx.scaffold,
  nginx.start,
  nginx.location('/ngineer').proxy('https://github.com/DamonOehlman/ngineer')
], function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('started nginx, pid: ' + nginx.pid);
  console.log('proxying google at http://localhost:8080/ngineer');
});

nginx.stopOnExit();
```

The above example proxies a request from <http://localhost:8080/ngineer> through to <https://github.com/DamonOehlman/ngineer>.  A more practical example is shown below where we proxy a local [express](https://github.com/visionmedia/express) application through nginx.

```js
const async = require('async');
const express = require('express');

const nginx = require('ngineer')(__dirname + '/nginx', {
  port: 8080
});

// create our simple express app
express()
  .get('/', function(req, res) {
    res.end('Hi there');
  })
  .listen(3000, function(err) {
    if (err) {
      return console.error('could not start bind express app to port 3000', err);
    }

    async.series([
      nginx.scaffold,
      nginx.start,
      nginx.location('/express-test').proxy('http://localhost:3000/')
    ], function(err) {
      if (err) {
        return console.error(err);
      }

      console.log('started nginx, pid: ' + nginx.pid);
      console.log('express app available at http://localhost:8080/express-test');
    });
  });

nginx.stopOnExit();
```

## How it Works

Ngineer expects that it will have a nginx configuration folder that it s responsible for managing (see the `-p` commandline argument).  While ngineer doesn't require that it is reponsible for running the nginx process, it is happy to do this.  If you do decide to use this option then ensure that you upstart (or similar) the node process running nginx.

### Expected Traffic Flow

When using ngineer it's important to note that you are probably accepting a few levels of HTTP proxying to make the magic happen.  In the case of new version of [steelmesh](https://github.com/steelmesh/steelmesh) that is under development, we are using an archictecture similar to what is displayed below:

```
+----------------+      +----------------+      +----------------+
|                |+---->|                |+---->|                |
|     HAproxy    |      |      nginx     |      |      node      |
|                |<----+|                |<----+|                |
+----------------+      +----------------+      +----------------+
```

### Handling nginx restarts

Ngineer communicates with the `nginx` process and sends the `HUP` [signal](http://wiki.nginx.org/CommandLine#Loading_a_New_Configuration_Using_Signals)
to flag the the nginx configuration should be reloaded and nginx gracefully restarted.

## Why ngineer?

Why do you want this?  Well, because `nginx` does a kick arse job of serving
static files and also proxying services so this provides you an option of using it
over node based proxying solutions.

## Prior Art

* [nginx-http-proxy](https://github.com/liamoehlman/nginx-http-proxy)

## Alternative Projects

Before using `ngineer` you should consider also consider the following
projects (in addition to those listed in Prior Art):

* [nginx-vhosts](https://github.com/maxogden/nginx-vhosts)

## License(s)

### MIT

Copyright (c) 2017 Damon Oehlman <mailto:damon.oehlman@gmail.com>

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

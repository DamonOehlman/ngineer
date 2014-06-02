var async = require('async');
var express = require('express');

var nginx = require('..')(__dirname + '/nginx', {
  port: 8080
});
var proxy = nginx.location('/express-test').proxy('http://localhost:3000/');

// create our simple express app
express()
  .get('/', function(req, res) {
    res.end('Hi there');
  })
  .listen(3000, function(err) {
    if (err) {
      return console.error('could not start bind express app to port 3000', err);
    }

    async.series([ nginx.scaffold, nginx.start, proxy ], function(err) {
      if (err) {
        return console.error(err);
      }

      console.log('started nginx, pid: ' + nginx.pid);
      console.log('express app available at http://localhost:8080/express-test');
    });
  });


var async = require('async');
var nginx = require('..')(__dirname + '/nginx', {
  port: 8080
});
var express = require('express');
var app = express();

// create our simple express app
app.get('/', function(req, res) {
  res.end('Hi there');
});
app.listen(3000);

async.series([ nginx.scaffold, nginx.start ], function(err) {
  if (err) {
    return console.error(err);
  }

  nginx.location('/express-test').proxy('http://localhost:3000/').save(function(err) {
    console.log('started nginx, pid: ' + nginx.pid);
    console.log('express app available at http://localhost:8080/express-test');
  });
});

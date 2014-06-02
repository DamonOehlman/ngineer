var async = require('async');
var nginx = require('..')(__dirname + '/demo', {
  port: 8080
});

async.series([ nginx.scaffold, nginx.start ], function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('started nginx, pid: ' + nginx.pid);
});

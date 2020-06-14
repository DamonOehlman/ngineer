const async = require('async');
const nginx = require('..')(__dirname + '/nginx', {
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

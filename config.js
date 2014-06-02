var async = require('async');
var fs = require('fs');
var path = require('path');
var executables = exports.executables = [
  path.resolve('nginx'),
  '/usr/sbin/nginx'
];

exports.command = function(basePath, callback) {
  async.filter(executables, fs.exists, function(results) {
    if (results.length === 0) {
      callback(new Error('No nginx executable found'));
    }

    callback(null, results[0] + ' -p ' + basePath + '/ -c conf/nginx.conf');
  });
};

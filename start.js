var async = require('async');
var debug = require('debug')('ngineer:start');
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');

var NGINX_EXECUTABLES = [
  path.resolve('nginx'),
  '/usr/sbin/nginx'
];

module.exports = function(ngineer, basePath, opts) {
  return function(callback) {
    async.filter(NGINX_EXECUTABLES, fs.exists, function(results) {
      var command = results[0] + ' -p ' + basePath + '/ -c conf/nginx.conf';

      if (results.length === 0) {
        return callback(new Error('no nginx executable found'));
      }

      // if already online do nothing
      if (ngineer.online) {
        return callback();
      }

      debug('running: ' + command);
      exec(command, function(err) {
        debug('started: ', err);

        if (err) {
          return callback(err);
        }

        // monitor for nginx starting
        ngineer.once('online', callback);
      });
    });
  };

};

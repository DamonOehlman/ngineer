var async = require('async');
var debug = require('debug')('ngineer:start');
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var config = require('./config');

module.exports = function(ngineer, basePath, opts) {
  var startTimeout;
  var command;

  function nginxStart(callback) {
    return function() {
      debug('running: ' + command);
      exec(command, function(err) {
        debug('started: ', err);

        if (err) {
          return callback(err);
        }
      });
    }
  }

  return function(callback) {
    async.filter(config.executables, fs.exists, function(results) {
      command = results[0] + ' -p ' + basePath + '/ -c conf/nginx.conf';

      if (results.length === 0) {
        return callback(new Error('no nginx executable found'));
      }

      // if already online do nothing
      if (ngineer.online) {
        return callback();
      }

      ngineer.once('online', function() {
        clearTimeout(startTimeout);
        callback();
      });

      startTimeout = setTimeout(nginxStart(callback), 500);
    });
  };

};

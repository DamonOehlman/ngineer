var async = require('async');
var debug = require('debug')('ngineer:start');
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var config = require('./config');

module.exports = function(ngineer, basePath, opts) {
  var command;

  function nginxStart(callback) {
    debug('running: ' + command);
    exec(command, function(err) {
      debug('started: ', err);

      if (err) {
        return callback(err);
      }

      callback();
    });
  }

  return function(callback) {
    var startTimeout;

    function handleOnline() {
      debug('detected nginx online');
      clearTimeout(startTimeout);
      callback();
    }

    async.filter(config.executables, fs.exists, function(results) {
      command = results[0] + ' -p ' + basePath + '/ -c conf/nginx.conf';

      if (results.length === 0) {
        return callback(new Error('no nginx executable found'));
      }

      // if already online do nothing
      if (ngineer.online) {
        return callback();
      }

      ngineer.once('online', handleOnline);

      startTimeout = setTimeout(function() {
        ngineer.removeListener('online', handleOnline);
        nginxStart(callback);
      }, 500);
    });
  };

};

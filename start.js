var async = require('async');
var debug = require('debug')('ngineer:start');
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var config = require('./config');

module.exports = function(ngineer, basePath, opts) {
  function nginxStart(callback) {
    config.command(basePath, function(err, command) {
      if (err) {
        return callback(err);
      }

      debug('running: ' + command);
      exec(command, function(err) {
        debug('started: ', err);

        if (err) {
          return callback(err);
        }

        callback();
      });
    });
  }

  return function(callback) {
    var startTimeout;

    function handleOnline() {
      debug('detected nginx online');
      clearTimeout(startTimeout);
      callback();
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
  };
};

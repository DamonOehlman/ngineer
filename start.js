const async = require('async');
const debug = require('debug')('ngineer:start');
const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');
const config = require('./config');

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
    let startTimeout;

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

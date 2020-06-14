const async = require('async');
const debug = require('debug')('ngineer:stop');
const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');
const config = require('./config');

module.exports = function(ngineer, basePath, opts) {
  return function(callback) {
    config.command(basePath, function(err, command) {
      if (err) {
        return callback(err);
      }

      debug(`running: ${command} -s stop`);
      exec(`${command} -s stop`, function() {
        callback();
      });
    });
  };
};

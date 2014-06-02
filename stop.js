var async = require('async');
var debug = require('debug')('ngineer:start');
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var config = require('./config');

module.exports = function(ngineer, basePath, opts) {
  return function(callback) {
    config.command(basePath, function(err, command) {
      if (err) {
        return callback(err);
      }

      debug('running: ' + command + ' -s stop');
      exec(command + ' -s stop', callback);
    });
  };
};

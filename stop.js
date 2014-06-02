var async = require('async');
var debug = require('debug')('ngineer:start');
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var config = require('./config');

module.exports = function(ngineer, basePath, opts) {
  return function(callback) {
    async.filter(config.executables, fs.exists, function(results) {
      var command = results[0] + ' -p ' + basePath + '/ -c conf/nginx.conf -s stop';

      if (results.length === 0) {
        return callback(new Error('no nginx executable found'));
      }

      debug('running: ' + command);
      exec(command, callback);
    });
  };

};

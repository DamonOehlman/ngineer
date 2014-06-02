var async = require('async');
var debug = require('debug')('ngineer:reset');
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var config = require('./config');

module.exports = function(ngineer, basePath, opts) {
  return function(callback) {
    var configPath = path.join(basePath, 'conf');

    fs.readdir(configPath, function(err, files) {
      files = files.map(function(filename) {
        return path.join(configPath, filename);
      });

      debug('deleting config files: ', files);
      async.forEach(files || [], fs.unlink, function(err) {
        if (err) {
          debug('could not delete config files, aborting stop');
          return callback(err);
        }

        debug('attempting to stop nginx');
        ngineer.stop(callback);
      });
    });
  };
};

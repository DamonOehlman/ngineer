const async = require('async');
const debug = require('debug')('ngineer:reset');
const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');
const config = require('./config');

module.exports = function(ngineer, basePath, opts) {
  return function(callback) {
    const configPath = path.join(basePath, 'conf');

    fs.readdir(configPath, function(err, files) {
      const filesToDelete = files.map(function(filename) {
        return path.join(configPath, filename);
      });

      debug('deleting config files: ', files);
      async.forEach(filesToDelete || [], fs.unlink, function(err) {
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

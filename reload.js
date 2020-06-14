const debug = require('debug')('ngineer:reload');
const exec = require('child_process').exec;
const config = require('./config');

module.exports = function(nginx, basePath, opts) {
  return function(callback) {
    config.command(basePath, function(err, command) {
      if (err) {
        return callback(err);
      }

      exec(command + ' -t', function(err) {
        if (err) {
          return callback(err);
        }

        debug('reloading nginx config: ' + command + ' -s reload');
        exec(command + ' -s reload', function(err) {
          if (err) {
            return callback(err);
          }

          setTimeout(callback, (opts || {}).reloadDelay || 500);
        });
      });
    });
  };
};

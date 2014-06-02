var async = require('async');
var fs = require('fs');
var path = require('path');
var possibleExecutables = exports.executables = [
  path.resolve('nginx'),
  '/usr/sbin/nginx'
];

exports.command = function(basePath, callback) {
  async.filter(possibleExecutables, fs.exists, function(executables) {
    async.map(executables, fs.stat, function(err, results) {
      if (err) {
        return callback(err);
      }

      // find the first result that is a file
      results = results
        .map(function(stats, idx) {
          return {
            stats: stats,
            executable: executables[idx]
          };
        })
        .filter(function(data) {
          return data.stats.isFile();
        });

      if (results.length === 0) {
        return callback(new Error('No nginx executable found'));
      }

      callback(
        null,
        results[0].executable + ' -p ' + basePath + '/ -c conf/nginx.conf'
      );
    });
  });
};

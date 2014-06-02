var async = require('async');
var debug = require('debug')('ngineer:scaffold');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');
var replaceStream = require('replacestream');
var CONFIG_DIRS = [ 'conf', 'html', 'logs' ];
var REQUIRED_FILES = [
  'conf/mime.types',
  'conf/nginx.conf',
  'html/index.html'
];

module.exports = function(ngineer, basePath, opts) {
  var scaffoldBase = path.resolve(__dirname, 'scaffold');

  function scaffoldFile(target, callback) {
    var src = path.join(scaffoldBase, target.slice(basePath.length));
    var writer = fs.createWriteStream(target);
    var reader = fs.createReadStream(src);

    debug('scaffolding file: ' + src);
    reader.on('error', callback);
    writer.on('error', callback).on('close', callback);

    reader
      .pipe(replaceStream('{{ port }}', (opts || {}).port || 8080))
      .pipe(replaceStream('{{ worker_connections }}', (opts || {}).worker_connections || 1024 ))
      .pipe(writer);
  }

  return function(callback) {
    var configPaths = CONFIG_DIRS.map(function(subpath) {
      return path.join(basePath, subpath);
    });

    var requiredFiles = REQUIRED_FILES.map(function(subpath) {
      return path.join(basePath, subpath);
    });

    debug('ensuring required directories exist: ', configPaths);
    async.forEach(configPaths, mkdirp, function(err) {
      if (err) {
        return callback(err);
      }

      async.reject(requiredFiles, fs.exists, function(results) {
        async.forEach(results, scaffoldFile, function(err) {
          debug('scaffolding complete');
          callback(err);
        });
      });
    });
  };
};

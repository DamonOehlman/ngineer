const async = require('async');
const debug = require('debug')('ngineer:scaffold');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const replaceStream = require('replacestream');
const CONFIG_DIRS = [ 'conf', 'html', 'logs' ];
const REQUIRED_FILES = [
  'conf/mime.types',
  'conf/nginx.conf',
  'html/index.html'
];

const checkFileExists = (filename, callback) => fs.access(filename, err => callback(null, !err));

module.exports = function(ngineer, basePath, opts) {
  const scaffoldBase = path.resolve(__dirname, 'scaffold');

  function scaffoldFile(target, callback) {
    const src = path.join(scaffoldBase, target.slice(basePath.length));
    const writer = fs.createWriteStream(target);
    const reader = fs.createReadStream(src);

    debug('scaffolding file: ' + src);
    reader.on('error', callback);
    writer.on('error', callback).on('close', callback);

    reader
      .pipe(replaceStream('{{ port }}', (opts || {}).port || 8080))
      .pipe(replaceStream('{{ worker_connections }}', (opts || {}).worker_connections || 1024 ))
      .pipe(writer);
  }

  return function(callback) {
    const configPaths = CONFIG_DIRS.map(function(subpath) {
      return path.join(basePath, subpath);
    });

    const requiredFiles = REQUIRED_FILES.map(function(subpath) {
      return path.join(basePath, subpath);
    });

    debug('ensuring required directories exist: ', configPaths);
    Promise.all(configPaths.map(requiredPath => mkdirp(requiredPath)))
      .then(() => {
        debug('required directories exist, checking for required files: ', requiredFiles);
        async.reject(requiredFiles, checkFileExists, function(err, results) {
          async.forEach(results, scaffoldFile, function(scaffoldErr) {
            debug('scaffolding complete');
            callback(scaffoldErr);
          });
        });
      })
      .catch(callback);
  };
};

const async = require('async');
const fs = require('fs');
const path = require('path');

const possibleExecutables = exports.executables = [
  path.resolve('nginx'),
  '/usr/sbin/nginx',
  '/usr/local/bin/nginx'
];

exports.command = function(basePath, callback) {
  const existingFiles = possibleExecutables.filter(fs.existsSync);

  async.map(
    existingFiles,
    (executable, cb) => fs.stat(executable, cb),
    findFirstFile
  );

  function findFirstFile(err, results) {
    if (err) {
      return callback(err);
    }

    // find the first result that is a file
    results = results
      .map((stats, idx) => ({
        stats: stats,
        executable: existingFiles[idx]
      }))
      .filter(data => data.stats.isFile());

    if (results.length === 0) {
      return callback(new Error('No nginx executable found'));
    }

    callback(null, `${results[0].executable} -p ${basePath}/ -c conf/nginx.conf`);
  }
};

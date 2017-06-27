const debug = require('debug')('ngineer:tests');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const nginxExecutable = [
  '/usr/sbin/nginx',
  '/usr/local/bin/nginx'
].filter(file => fs.existsSync(file))[0];
const serverPath = path.resolve(__dirname, '..', 'integration', 'server');
const nginxCommand = `${nginxExecutable} -p ${serverPath}/ -c conf/nginx.conf`;

function nginx(command) {
  return function(callback) {
    if (!nginxExecutable) {
      return callback(new Error('nginx not found on machine'));
    }

    debug('running: ' + command);
    exec(command, function(err) {
      debug('started: ', err);

      if (err) {
        return callback(err);
      }

      setTimeout(callback, 1000);
    });
  };
}

exports.path = serverPath;
exports.start = nginx(nginxCommand);
exports.stop = nginx(nginxCommand + ' -s stop');
exports.url = 'http://localhost:8886';

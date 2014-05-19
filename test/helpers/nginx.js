var debug = require('debug')('ngineer:tests');
var path = require('path'),
    exec = require('child_process').exec,
    serverPath = path.resolve(__dirname, '..', 'integration', 'server'),
    nginxCommand = '/usr/sbin/nginx -p ' + serverPath + '/ -c conf/nginx.conf';

function nginx(command) {
  return function(callback) {
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

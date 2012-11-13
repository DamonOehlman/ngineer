var path = require('path'),
    exec = require('child_process').exec,
    serverPath = path.resolve(__dirname, '..', 'integration', 'server'),
    nginxCommand = 'nginx -p ' + serverPath + ' -c conf/nginx.conf';

exports.path = serverPath;
exports.start = exec.bind(exec, nginxCommand);
exports.stop = exec.bind(exec, nginxCommand + ' -s stop');
exports.url = 'http://localhost:8886';
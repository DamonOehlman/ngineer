var fs = require('fs'),
    path = require('path'),
    events = require('events'),
    util = require('util');

function Ngineer(basePath) {
    // create a file system watcher for the pid file
    this.watcher = fs.watch(path.resolve())
}

module.exports = function(path) {

};
var fs = require('fs'),
    path = require('path'),
    events = require('events'),
    util = require('util'),
    NginxLocation = require('./lib/location');

function Ngineer(basePath) {
    events.EventEmitter.call(this);

    // initialise to not online
    this.online = false;
    // create a file system watcher for the pid file
    // this.watcher = fs.watch(path.resolve(basePath, ))
}

util.inherits(Ngineer, events.EventEmitter);

Ngineer.prototype.location = function(pattern) {
    return new NginxLocation(pattern, this);
};

/**
## reload()

The reload method sends the reload configuration (HUP) signal to the nginx process.
*/
Ngineer.prototype.reload = function() {
    // TODO: send the signal

    return this;
};


module.exports = function(basePath) {
    return new Ngineer(basePath);
};
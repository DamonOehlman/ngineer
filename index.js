var debug = require('debug')('ngineer'),
    fs = require('fs'),
    path = require('path'),
    events = require('events'),
    util = require('util'),
    procinfo = require('procinfo'),
    NginxLocation = require('./lib/location');

function Ngineer(basePath, opts) {
    events.EventEmitter.call(this);

    // ensure we have opts
    opts = opts || {};

    // initialise the basepath to the path provided
    this.basePath = path.resolve(basePath);

    // initialise to not online
    this.online = false;

    // setup monitoring of the pid file
    this._readPID(opts);
    // create a file system watcher for the pid file
    // this.watcher = fs.watch(path.resolve(basePath, ))

    // look for t
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

/* internal methods */

Ngineer.prototype._readPID = function(opts) {
    var pidLocation = path.resolve(this.basePath, opts.pidFile || 'logs/nginx.pid');

    // open the pid file
    fs.readFile(pidLocation, 'utf8', function(err, data) {
        // if we hit an error, then monitor the folder for changes - looking for the pid
        if (err) {

        }
        else {
            debug('looking up process information for process: ' + data);
            procinfo(parseInt(data, 10), function(err, processData) {
                console.log(processData);
            });
        }
    });
};


module.exports = function(basePath) {
    return new Ngineer(basePath);
};
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

    // initialise the location path
    this.locationPath = opts.locationPath || path.resolve(this.basePath, 'conf', 'locations');

    // initialise to not online
    this._online = false;

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
    var ngineer = this,
        pidLocation = path.resolve(this.basePath, opts.pidFile || 'logs/nginx.pid');

    // open the pid file
    fs.readFile(pidLocation, 'utf8', function(err, data) {
        var watchTarget = err ? path.dirname(pidLocation) : pidLocation;

        // if we hit an error opening the file, then the pid file does not exist
        // therefore we will assume that nginx is not running
        if (err) {
            // if we are currently online, then flag then update the flag and trigger the offline event
            if (ngineer.online) {
                ngineer.online = false;
            }
        }
        // otherwise, read the file and check on the process status
        else {
            debug('looking up process information for process: ' + data);
            procinfo(parseInt(data, 10), function(err, processData) {
                ngineer.online = !err;
            });
        }

        // watch the appropriate location and trigger a reread when something changes
        fs.watch(watchTarget, function(evt, filename) {
            this.close();
            ngineer._readPID(opts);
        });
    });
};

/* Ngineer properties */

Object.defineProperty(Ngineer.prototype, 'online', {
    get: function() {
        return this._online;
    },

    set: function(value) {
        // only update if we are toggling the state
        if (value !== this._online) {
            this._online = value;
            this.emit(value ? 'online' : 'offline');
        }
    }
});


module.exports = function(basePath) {
    return new Ngineer(basePath);
};
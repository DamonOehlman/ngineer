var debug = require('debug')('ngineer');
var fs = require('fs');
var path = require('path');
var events = require('events');
var util = require('util');
var procinfo = require('procinfo');
var exec = require('child_process').exec;
var NginxLocation = require('./location');

/**
  # ngineer

  ngineer is a node utility library that assists with dynamically adding
  locations to a server configuration by generating suitable
  [location](http://wiki.nginx.org/HttpCoreModule#location) directives in
  separate location files that can then be included into a core `nginx.conf`
  configuration file.

  <<< docs/howitworks.md

  ## Why ngineer?

  Why do you want this?  Well, because `nginx` does a kick arse job of serving
  static files and also proxying services so it makes sense you use it over
  pure node alternatives such as [node-http-proxy](https://github.com/nodejitsu/node-http-proxy).
  No offense is meant to the awesome [nodejitsu](nodejitsu.com) team here, but
  I feel much more comfortable using nginx over node to be the first line in
  serving both node applications and static content.

  ## Prior Art

  - [nginx-http-proxy](https://github.com/liamoehlman/nginx-http-proxy)

  ## Alternative Projects

  Before using `ngineer` you should consider also consider the following
  projects (in addition to those listed in Prior Art):

  - [nginx-vhosts](https://github.com/maxogden/nginx-vhosts)

**/

function Ngineer(basePath, opts) {
  if (! (this instanceof Ngineer)) {
    return new Ngineer(basePath, opts);
  }

  events.EventEmitter.call(this);

  // ensure we have opts
  opts = opts || {};

  // initialise the basepath to the path provided
  this.basePath = path.resolve(basePath);

  // initialise the location path
  this.locationPath = opts.locationPath || path.resolve(this.basePath, 'conf', 'locations');

  // initialise to not online
  this._online = false;

  // initialise the pid to undefined
  this._pid = undefined;

  // setup monitoring of the pid file
  this._readPID(opts);
  // create a file system watcher for the pid file
  // this.watcher = fs.watch(path.resolve(basePath, ))

  // look for t
}

util.inherits(Ngineer, events.EventEmitter);
module.exports = Ngineer;

Ngineer.prototype.location = function(pattern) {
  return new NginxLocation(pattern, this);
};

/**
## reload()

The reload method sends the reload configuration (HUP) signal to the nginx process.
*/
Ngineer.prototype.reload = function(callback) {
  exec('kill -s HUP ' + this._pid, callback);
};

/* internal methods */

Ngineer.prototype._readPID = function(opts) {
  var ngineer = this;
  var pidLocation = path.resolve(this.basePath, opts.pidFile || 'logs/nginx.pid');

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
        ngineer._pid = processData.pids[0];
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

var async = require('async');
var debug = require('debug')('ngineer');
var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var procinfo = require('procinfo');
var exec = require('child_process').exec;
var NginxLocation = require('./location');

/**
  # ngineer

  ngineer is a node automation later for nginx that assists with the following:

  - scaffolding a new nginx configuration folder (i.e. `conf/`, `html/`, `logs/`)
  - starting and reloading nginx using targeted base path
  - adding location proxy directives

  ## Getting Started

  <<< docs/getting-started.md

  ## How it Works

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

  ## Reference

  ### ngineer(basePath, opts)

**/
module.exports = function(basePath, opts) {
  var nginx = new EventEmitter();
  var online = false;
  var pidLocation = path.resolve(basePath, (opts || {}).pidFile || 'logs/nginx.pid');
  var pid = undefined;

  function readPID() {
    // open the pid file
    debug('looking for pid file: ' + pidLocation);
    fs.readFile(pidLocation, 'utf8', function(err, data) {
      var watchTarget = pidLocation;

      // if we hit an error opening the file, then the pid file does not exist
      // therefore we will assume that nginx is not running
      if (err) {
        // if we are currently online, then flag then update the flag and trigger the offline event
        if (nginx.online) {
          nginx.online = false;
        }
      }
      // otherwise, read the file and check on the process status
      else {
        debug('looking up process information for process: ' + data);
        procinfo(parseInt(data, 10), function(err, processData) {
          pid = processData && processData.pids[0];
          nginx.online = !err;
        });
      }

      // work up parent folders until we find a valid location
      while (! fs.existsSync(watchTarget)) {
        watchTarget = path.dirname(watchTarget);
      }

      // if the pid file has since been created read it again
      if (watchTarget === pidLocation) {
        return process.nextTick(readPID);
      }

      // watch the appropriate location and trigger a reread when something changes
      debug('watching: ' + watchTarget);
      fs.watch(watchTarget, function(evt, filename) {
        debug('target "' + watchTarget + '" changed');
        this.close();
        readPID();
      });
    });
  }

  /**
    #### location(pattern) => NginxLocation

    Create a new location directive for the nginx configuration

  **/
  nginx.location = function(pattern) {
    return new NginxLocation(pattern, nginx);
  };

  /**
    #### reload()

    The reload method sends the reload configuration (HUP) signal to the nginx process.

  **/
  nginx.reload = require('./reload')(nginx, basePath, opts);

  /**
    #### scaffold(callback)

    Scaffold an nginx configuration directory based on a known default
    configuration.
  **/
  nginx.scaffold = require('./scaffold')(nginx, basePath, opts);

  /**
  #### start(callback)

  Attempt to start nginx by using a few well known nginx binary locations.

**/
  nginx.start = require('./start')(nginx, basePath, opts);


  Object.defineProperty(nginx, 'online', {
    get: function() {
      return online;
    },

    set: function(value) {
      // only update if we are toggling the state
      if (value !== online) {
        online = value;
        nginx.emit(value ? 'online' : 'offline');
      }
    }
  });

  Object.defineProperty(nginx, 'pid', {
    get: function() {
      return pid;
    }
  });

  nginx.locationPath = (opts || {}).locationPath || path.resolve(basePath, 'conf', 'locations');
  readPID();

  return nginx;
};

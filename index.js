const async = require('async');
const debug = require('debug')('ngineer');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const procinfo = require('procinfo');
const exec = require('child_process').exec;

const createLocation = require('./sections/location');

module.exports = function(basePath, opts) {
  const nginx = new EventEmitter();
  const pidLocation = path.resolve(basePath, (opts || {}).pidFile || 'logs/nginx.pid');
  let online = false;
  let pid = undefined;

  function monitorProcess(targetPid) {
    debug('looking up process information for process: ' + targetPid);
    procinfo(targetPid, function(err, processData) {
      pid = processData && processData.pids[0];
      nginx.online = !err;

      if (pid) {
        setTimeout(function() {
          monitorProcess(targetPid)
        }, 500);
      }
    });
  }

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
        return monitorProcess(parseInt(data, 10));
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
  nginx.location = pattern => createLocation(nginx, basePath, {
    ...opts,
    pattern,
  });

  /**
    #### reload()

    The reload method sends the reload configuration (HUP) signal to the nginx process.

  **/
  nginx.reload = require('./reload')(nginx, basePath, opts);

  /**
    #### reset()

    The reset function cleans out the config directory and stops the nginx running if
    is running.
  **/
  nginx.reset = require('./reset')(nginx, basePath, opts);

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


  /**
    #### stop(callback)


    Stop the nginx process
  **/
  nginx.stop = require('./stop')(nginx, basePath, opts);


  Object.defineProperty(nginx, 'online', {
    get: function() {
      return online;
    },

    set: function(value) {
      // only update if we are toggling the state
      if (value !== online) {
        online = value;
        nginx.emit(value ? 'online' : 'offline');

        // if we have gone offline start looking for the pid again
        if (! value) {
          process.nextTick(readPID);
        }
      }
    }
  });

  Object.defineProperty(nginx, 'pid', {
    get: function() {
      return pid;
    }
  });

  nginx.basePath = basePath;
  readPID();

  return nginx;
};

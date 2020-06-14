const debug = require('debug')('ngineer:stop-on-exit');

module.exports = function(ngineer) {
  function stopNginxAndExit() {
    debug('terminate detected, stopping nginx and exiting process');
    ngineer.stop(() => process.exit(0));
  }

  return function() {
    process.on('exit', ngineer.stop);
    process.on('SIGINT', stopNginxAndExit);
    process.on('uncaughtException', stopNginxAndExit);
  };
};

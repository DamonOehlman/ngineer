var async = require('async');
var debug = require('debug')('ngineer:scaffold');

module.exports = function(ngineer, basePath, opts) {
  return function(callback) {
    callback();
  };
};

var debug = require('debug')('ngineer:section');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');

module.exports = function(nginx, basePath, opts) {
  var section = {};
  var directives = [];

  section.directive = function() {
    directives.push([].slice.call(arguments));
  };

  section.save = function(callback) {
    var filename = path.join(basePath, 'conf', section.filename);

    // if the section doesn't have a filename, then do nothing
    if (! section.filename) {
      return callback();
    }

    mkdirp(path.dirname(filename), function(err) {
      if (err) {
        return callback(err);
      }

      debug('writing section file: ' + filename);
      fs.writeFile(filename, section.output, 'utf8', function(err) {
        if (err) {
          return callback(err);
        }

        nginx.reload(callback);
      });
    });
  };

  Object.defineProperty(section, 'directives', {
    get: function() {
      return [].concat(directives);
    }
  });

  return section;
};

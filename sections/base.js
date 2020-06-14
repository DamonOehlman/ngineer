const debug = require('debug')('ngineer:section:base');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

module.exports = function(nginx, basePath, opts) {
  const directives = [];

  function section(callback) {
    debug(`initializing section for basepath = ${basePath}, filename = ${section.filename}`);
    const filename = path.join(basePath, 'conf', section.filename);

    // if the section doesn't have a filename, then do nothing
    if (! section.filename) {
      return callback();
    }

    mkdirp(path.dirname(filename))
      .then(() => {
        debug('writing section file: ' + filename);
        fs.writeFile(filename, section.output, 'utf8', function(err) {
          if (err) {
            return callback(err);
          }

          nginx.reload(callback);
        });
      })
      .catch(callback);
  }

  section.directive = function() {
    directives.push([].slice.call(arguments));
  };

  section.save = section;

  Object.defineProperty(section, 'directives', {
    get: function() {
      return [].concat(directives);
    }
  });

  return section;
};

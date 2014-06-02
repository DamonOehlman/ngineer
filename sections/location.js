var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');
var reStripChars = /(^\/|\s|\/$)/g;
var reToUnderscore = /\//;

/**
  ### location(pattern)

  Create a location section for the nginx configuraton.

**/
module.exports = function(nginx, basePath, opts) {
  var section = require('./base')(nginx, basePath, opts);
  var pattern;

  /**
    #### proxy(targetUrl)

    Include a [proxy_pass](http://wiki.nginx.org/HttpProxyModule#proxy_pass)
    directive into the location
  **/
  section.proxy = function(targetUrl, opts) {
    section.directive('proxy_pass', targetUrl);
    section.directive('proxy_http_version', (opts || {}).httpVersion || '1.1');
    section.directive('proxy_set_header', 'Upgrade $http_upgrade');
    section.directive('proxy_set_header', 'Connection "upgrade"');

    return section;
  };

  Object.defineProperty(section, 'pattern', {
    set: function(value) {
      pattern = value;

      // set the filename for the configuration section
      section.filename = 'locations/' +
        pattern.replace(reStripChars, '').replace(reToUnderscore, '_');
    }
  });

  Object.defineProperty(section, 'output', {
    get: function() {
      var lines = section.directives.map(function(parts) {
        return '  ' + parts.join(' ') + ';';
      });

      // generate the output
      return 'location ' + pattern + ' {\n' + lines.join('\n') + '\n}\n';
    }
  });

  return section;
};

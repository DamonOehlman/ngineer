const debug = require('debug')('ngineer:section:location');
const reStripChars = /(^\/|\s|\/$)/g;
const reToUnderscore = /\//;
const createSection = require('./base');

module.exports = function(nginx, basePath, { pattern, ...opts }) {
  debug(`creating location section, pattern: ${pattern}`)

  const section = createSection(nginx, basePath, opts);

  section.filename = `locations/${pattern.replace(reStripChars, '').replace(reToUnderscore, '_')}`;
  section.proxy = function(targetUrl, opts) {
    section.directive('proxy_pass', targetUrl);
    section.directive('proxy_http_version', (opts || {}).httpVersion || '1.1');
    section.directive('proxy_set_header', 'Upgrade $http_upgrade');
    section.directive('proxy_set_header', 'Connection "upgrade"');

    return section;
  };

  Object.defineProperty(section, 'output', {
    get: function() {
      const lines = section.directives.map(parts => ` ${parts.join(' ')};`);
      return `location ${pattern} {\n${lines.join('\n')}\n}\n`;
    }
  });

  return section;
};

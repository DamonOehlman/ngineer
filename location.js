var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');
var reStripChars = /(^\/|\s|\/$)/g;
var reToUnderscore = /\//;

/**
  ## NginxLocation

  The NginxLocation class is used to define information regarding an nginx
  location directive.

**/
function NginxLocation(pattern, nginx) {
  if (! (this instanceof NginxLocation)) {
    return new NginxLocation(pattern, nginx);
  }

  // save a reference to the nginx instance
  this.nginx = nginx;

  // initialise the pattern
  this.pattern = pattern;

  // initialise the name based on the pattern
  this.name = pattern.replace(reStripChars, '').replace(reToUnderscore, '_');

  // initialise the array of directives to write to the file
  this.directives = [];
}

module.exports = NginxLocation;
var prot = NginxLocation.prototype;

/**
  ### directive(args*)

**/
prot.directive = function() {
  this.directives.push([].slice.call(arguments));
  return this;
};

/**
  ### proxy(targetUrl)

  Include a [proxy_pass](http://wiki.nginx.org/HttpProxyModule#proxy_pass)
  directive into the location
**/
prot.proxy = function(targetUrl) {
  return this.directive('proxy_pass', targetUrl);
};

/**
  ### save(callback)

  The save method is used to write the location file in the /locations path
  in the server/conf directory

**/
prot.save = function(callback) {
  var location = this;
  var nginx = this.nginx;
  var locationFile = path.join(nginx.locationPath, location.name + '.conf');
  var outputLines;
  var output;

  // ensure the location path exists
  mkdirp(nginx.locationPath, function(err) {
    if (err) {
      return callback(err);
    }

    // create the outputlines
    outputLines = location.directives.map(function(parts) {
      return '  ' + parts.join(' ') + ';';
    });

    // generate the output
    output = 'location ' + location.pattern + ' {\n' + outputLines.join('\n') + '\n}\n';

    // write the location file
    fs.writeFile(locationFile, output, 'utf8', callback);
  });
};

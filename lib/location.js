var mkdirp = require('mkdirp'),
    fs = require('fs'),
    path = require('path');

/**
# NginxLocation

The NginxLocation class is used to define information regarding an nginx location directive.
*/
function NginxLocation(pattern, nginx) {
    // initialise the array of directives to write to the file
    this.directives = [];
}

NginxLocation.prototype = {
    /**
    ## directive(args*)
    */
    directive: function() {
        this.directives.push(Array.prototype.slice.call(arguments));

        return this;
    },

    /**
    ## proxy(targetUrl)

    Include a [proxy_pass](http://wiki.nginx.org/HttpProxyModule#proxy_pass) directive into the 
    location.
    */
    proxy: function(targetUrl) {
        return this.directive('proxy_pass', targetUrl);
    },

    /**
    ## save(callback)

    The save method is used to write the location file in the /locations path in the server/conf directory
    */
    save: function(callback) {

    }
};

module.exports = NginxLocation;
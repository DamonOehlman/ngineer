The following example shows how the `ngineer` module can be used to scaffold and start nginx within an application.

<<< examples/proxy-ngineer.js

The above example proxies a request from http://localhost:8080/ngineer through to https://github.com/DamonOehlman/ngineer.  A more practical example is shown below where we proxy a local [express](https://github.com/visionmedia/express) application through nginx.

<<< examples/proxy-express.js

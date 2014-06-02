Ngineer expects that it will have a nginx configuration folder that it s responsible for managing (see the `-p` commandline argument).  While ngineer doesn't require that it is reponsible for running the nginx process, it is happy to do this.  If you do decide to use this option then ensure that you upstart (or similar) the node process running nginx.

### Expected Traffic Flow

When using ngineer it's important to note that you are probably accepting a few levels of HTTP proxying to make the magic happen.  In the case of new version of [steelmesh](https://github.com/steelmesh/steelmesh) that is under development, we are using an archictecture similar to what is displayed below:

```
   +----------------+      +----------------+      +----------------+
   |                |+---->|                |+---->|                |
   |     HAproxy    |      |      nginx     |      |      node      |
   |                |<----+|                |<----+|                |
   +----------------+      +----------------+      +----------------+
```

### Handling nginx restarts

Ngineer communicates with the `nginx` process and sends the `HUP` [signal](http://wiki.nginx.org/CommandLine#Loading_a_New_Configuration_Using_Signals)
to flag the the nginx configuration should be reloaded and nginx gracefully restarted.

var ngineer = require('../../'),
    path = require('path'),
    assert = require('assert'),
    exec = require('child_process').exec,
    testServer = require('../helpers/test-server'),
    nginx = require('../helpers/nginx'),
    request = require('supertest'),
    rimraf = require('rimraf'),
    instance;

// bind the request arg
// request = request.bind(request, 'http://localhost:8886');

describe('start nginx', function() {
  after(nginx.stop);

  it('should be able to create an ngineer instance', function() {
    instance = ngineer(nginx.path);
    assert(instance instanceof ngineer);
  });

  it('should be able to start nginx', function(done) {
    instance.start(function(err) {
      assert.ifError(err);
      done(err);
    });
  });

  it('should validate nginx is running', function(done) {
     request(nginx.url).get('/').expect(200, done);
  });
})

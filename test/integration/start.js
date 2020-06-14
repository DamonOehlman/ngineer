const ngineer = require('../../');
const { EventEmitter } = require('events');
const path = require('path');
const assert = require('assert');
const { exec } = require('child_process');
const nginx = require('../helpers/nginx');
const request = require('supertest');
const rimraf = require('rimraf');

describe('start nginx', function() {
  let instance;

  after(nginx.stop);

  it('should be able to create an ngineer instance', function() {
    instance = ngineer(nginx.path);
    assert(instance instanceof EventEmitter);
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

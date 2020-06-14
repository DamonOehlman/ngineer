const debug = require('debug')('ngineer:test:add-location');
const ngineer = require('../../');
const path = require('path');
const assert = require('assert');
const exec = require('child_process').exec;
const { createTestServer } = require('../helpers/test-server');
const nginx = require('../helpers/nginx');
const request = require('supertest');
const rimraf = require('rimraf');

describe('add location', function() {
  let instance;
  let testServer;

  before(nginx.start);
  before(() => {
    testServer = createTestServer();
  });

  after(nginx.stop);
  after(done => rimraf(path.join(nginx.path, 'conf', 'locations'), done));
  after(() => {
    testServer.close();
  });

  it('should validate nginx is running', function(done) {
    request(nginx.url).get('/').expect(200, done);
  });

  it('should be able to create an ngineer instance', function(done) {
    instance = ngineer(nginx.path).once('online', done);
  });

  it('should be able to start the test node server', function(done) {
    testServer.listen(3000, done);
  });

  it('should be able to validate the test server is running', function(done) {
    request(testServer)
      .get('/')
      .expect('Test Server')
      .expect(200, done);
  });

  it('should be able to add a new location to the nginx server', function(done) {
    instance
      .location('/test')
      .proxy('http://localhost:3000/')
      .save(done);
  });

  it('should be able to request the new location', function(done) {
    request(nginx.url).get('/test').expect(200, done);
  });
})

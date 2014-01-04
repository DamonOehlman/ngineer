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

describe('add location', function() {
    before(nginx.start);

    after(nginx.stop);
    after(testServer.close.bind(testServer));
    after(rimraf.bind(null, path.join(nginx.path, 'conf', 'locations')));

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

    it('should be able to request an nginx configuration reload', function(done) {
        instance.reload(function(err) {
            assert.ifError(err);

            // give nginx a chance to reload
            setTimeout(done, 500);
        });
    });

    it('should be able to request the new location', function(done) {
        request(nginx.url).get('/test').expect(200, done);
    });
})
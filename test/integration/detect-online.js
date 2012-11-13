var ngineer = require('../../'),
    path = require('path'),
    assert = require('assert'),
    exec = require('child_process').exec,
    nginx = require('../helpers/nginx'),
    request = require('supertest'),
    instance;

describe('add location test', function() {
    before(nginx.start);
    after(nginx.stop);

    it('should validate nginx is running', function(done) {
        request(nginx.url).get('/').expect(200, done);
    });

    it('should be able to create an ngineer instance and detect nginx online', function(done) {
        instance = ngineer(nginx.path).once('online', done);
    });

    it('should be able to stop nginx and receive an offline event', function(done) {
        instance.once('offline', done);
        nginx.stop();
    });

    it('should be able to detect nginx starting again', function(done) {
        instance.once('online', done);
        nginx.start();
    });
})
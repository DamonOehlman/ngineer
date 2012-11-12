var ngineer = require('../../'),
    path = require('path'),
    assert = require('assert'),
    exec = require('child_process').exec,
    testServer = require('../helpers/test-server'),
    serverPath = path.resolve(__dirname, 'server'),
    nginxCommand = 'nginx -p ' + serverPath + ' -c conf/nginx.conf',
    nginx,
    request = require('supertest'),
    baseUrl = 'http://localhost:8886';

// bind the request arg
// request = request.bind(request, 'http://localhost:8886');

describe('add location test', function() {
    before(exec.bind(exec, nginxCommand));

    after(exec.bind(exec, nginxCommand + ' -s stop'));
    after(testServer.close.bind(testServer));

    it('should validate nginx is running', function(done) {
        request(baseUrl).get('/').expect(200, done);
    });

    it('should be able to create an ngineer instance', function(done) {
        nginx = ngineer(serverPath).on('online', done);
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
        nginx.location('/test')
            .proxy('http://localhost:3000')
            .save(done);
    });

    it('should be able to request an nginx configuration reload', function() {
        nginx.reload();
    });

    it('should be able to request the new location', function(done) {
        done();
    });
})
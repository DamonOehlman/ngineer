const { createServer } = require('http');

exports.createTestServer = () => createServer((req, res) => {
  res.end('Test Server');
});

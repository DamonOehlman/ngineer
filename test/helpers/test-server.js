var server = require('http').createServer(function(req, res) {
  res.end('Test Server')
})

module.exports = server
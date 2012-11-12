var tako = require('tako'),
    app = tako();

app.route('/').text('Test Server');

module.exports = app.httpServer;
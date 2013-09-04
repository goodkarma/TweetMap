var db = require('redis');

module.exports = function(app) {
  db.createClient();
};

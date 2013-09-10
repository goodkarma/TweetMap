var path = require('path');
var cors = require('../controllers/cors.js');
var feed = require('../controllers/feed.js');
var preRegister = require('../controllers/pre-register.js');
var dbTest = require('../controllers/db-test.js');

module.exports = function(app) {

  app.get('/feed*', feed.stream);
  app.options('/feed*', cors.approve);

  app.get('/tweet-template', function(req, res){
    cors.approve(req, res);
    res.sendfile(path.join(__dirname, '../app/tweet-template.hjs'));
  });
  app.options('/tweet-template', cors.approve);

  app.post('/pre-register', preRegister);

};
var path = require('path');
var corsEnable = require('../controllers/cors-enable.js');
var feeds = require('../controllers/feeds.js');
var preRegister = require('../controllers/pre-register.js');

module.exports = function(app) {

  app.get('/feed/:id', feeds);
  app.options('/feed/:id', corsEnable);

  app.get('/tweet-template', function(req, res){
    corsEnable(req, res);
    res.sendfile(path.join(__dirname, '../app/tweet-template.hjs'));
  });
  app.options('/tweet-template', corsEnable);

  app.post('/pre-register', preRegister);

};
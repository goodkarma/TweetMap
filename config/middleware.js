var path = require('path');
var express = require('express');
var toobusy = require('toobusy');

module.exports = function(app) {
  // all environments
  app.set('port', process.env.PORT || 3000);
  app.set('env', process.env.NODE_ENV || 'development');
  app.enable('trust proxy');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  // Preliminary check if the server is too busy (overloaded with requests).
  // This call is extremely fast, and returns a state that is cached at a fixed interval.
  app.use(function(req, res, next) {
    if (toobusy()) res.send(503, "Sorry, our server is currently receiving \
    too many requests. Please try again in a few seconds.");
    else next();
  });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '../app')));
};

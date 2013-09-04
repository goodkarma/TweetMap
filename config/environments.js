var express = require('express');
var path = require('path');

module.exports = function(app) {
  // development only
  if (app.get('env') === 'development') {
    global.db = 'tweetmap-dev';
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
  }

  if (app.get('env') === 'production') {
    global.db = 'tweetmap';
  }
};
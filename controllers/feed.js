var cors = require('./cors.js');
var db = require('../models/user.js');
var twApi = require('../services/tw-api.js');
var fs = require('fs');
var path = require('path');

var feed = module.exports = {};

feed.stream = function (req, res) {
  cors.approve(req, res);
  //temporary oAuth token storage for Alpha version
  global.oAuth || (global.oAuth = fs.readFileSync(path.join(__dirname, '../o-auth.txt')));
  var auth = global.oAuth;
  // Check DB
  // user.getFeed(req.query.id);
  // If it's needed grab tweets from API
  twApi.get(req, res, auth);
};
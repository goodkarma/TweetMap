var twApiFetch = require('./tw-api-fetch.js');
var user = require('../models/user.js');

var interval = module.exports = {};

// Store all intervals in one object (to access deactivation later)
interval.list = {};

// Start 10 sec interval to fetch data from Twitter API, bound to user id
interval.start = function(id) {
  interval.list[id] = setInterval(function() {interval.operate(id);}, 10000);
};

// Operate or stop Twitter API requests
interval.operate = function(id) {
  user.checkTimer(id).then(
    function(reply) {
      if (reply !== -2) {
        twApiFetch(id);
      } else {
        clearInterval(interval.list[id]);
        delete interval.list[id];
      }
    }
  );
};
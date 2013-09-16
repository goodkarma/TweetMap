var twApiFetch = require('./tw-api-fetch.js');
var user = require('../models/user.js');
var feed = require('../models/feed.js');

var interval = module.exports = {};

// Store all intervals in one object, the "key" is the user id, while the "value"
// is used to count the tweets fetching in the beginning and warm it up
interval.list = {};

// Start interval to fetch data from Twitter API, bound to user id
interval.start = function(id) {
  interval.list[id] = 1;
  interval.operate(id);
};

// Operate or stop Twitter API requests
interval.operate = function(id) {
  user.checkTimer(id).then(
    function(reply) {
      if (reply !== -2) {
        twApiFetch(id);
        var count = interval.list[id];
        count < 15 && interval.list[id]++;
        var time = count * 1000;
        setTimeout(function() {
          interval.operate(id);
        }, time);
      } else {
        feed.delete(id);
        interval.list[id].count = 0;
      }
    }
  );
};
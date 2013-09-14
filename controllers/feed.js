var corsEnable = require('./cors-enable.js');
var user = require('../models/user.js');
var feed = require('../models/feed.js');
var interval = require('../services/tw-api-interval.js');

module.exports = function(req, res) {
  var id = req.params.id;
  // Check if user exists, otherwise send 404
  user.exists(id).then(
    function(reply) {
      if (reply) {
        corsEnable(req, res);
        user.setTimer(id).then(
          function() {
            // If interval is already active,
            // fetch feed from database and send response
            if (interval[id]) {
              feed.get(id).then(
                function(reply) {
                  res.json(reply);
                }
              );
            // Otherwise start interval, wait 2 sec,
            // fetch feed from database and send response
            } else {
              interval.start(id);
              setTimeout(function() {
                feed.get(id).then(
                  function(reply) {
                    res.json(reply);
                  }
                );
              }, 2000);
            }
          }
        );
      } else {
        res.send(404);
      }
    },
    function(err) {
      console.log(err);
    }
  );
};
var corsEnable = require('./cors-enable.js');
var user = require('../models/user.js');
var feed = require('../models/feed.js');
var interval = require('../services/tw-api-interval.js');

var getFeed = module.exports = function(req, res) {
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
            if (interval.list[id]) {
              feed.get(id).then(
                function(reply) {
                  // If there are no results from Twitter API, wait before
                  // sending response to avoid continuous requests form client
                  if (reply.length === 0) {
                    setTimeout(function() {
                      res.json(reply);
                    }, 6000);
                  // If there's only one result, check again in a couple
                  // of seconds (as they're probably coming in)
                  } else if (reply.length === 1) {
                    setTimeout(function() {
                      getFeed(req, res);
                    }, 2000);
                  // Else send response right away
                  } else {
                    res.json(reply);
                  }

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
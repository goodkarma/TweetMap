// Worker used to retrieve the latest tweets from the Twitter API
var stream = require('http-get');
var filter = require('./tw-api-filter.js');
var user = require('../models/user.js');
var feed = require('../models/feed.js');

var urlStart = 'https://api.twitter.com/1.1/search/tweets.json';
var urlEnd = '&result_type=recent&count=100';

module.exports = function(id) {
  // Set-up request url and headers
  var options = {
    headers: {
      'Host': 'api.twitter.com',
      'User-Agent': 'JSTweetMap',
      'Accept-Encoding': 'gzip'
    },
    bufferType: 'buffer'
  };

  user.get(id).then(
    function(reply) {
      var urlQuery = '?q=' + reply.query;
      options.url = urlStart + urlQuery + urlEnd;
      options.headers.Authorization = reply.authToken;
      // Fetch tweet stream, filter it and store it
      stream.get(options, function(error, result) {
        if (error) {
          console.error(error);
        } else {
          var feedArr = filter(JSON.parse(result.buffer).statuses);
          feed.store(id, feedArr);
        }
      });
    }
  );
};
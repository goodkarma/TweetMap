// Worker used to retrieve the latest tweets from the Twitter API
var stream = require('http-get');
var filter = require('./tw-api-filter.js');

// Set-up request url and headers
var options = {
  url: 'https://api.twitter.com/1.1/search/tweets.json?q=girls&result_type=recent&count=100',
  headers: {
    'Host': 'api.twitter.com',
    'User-Agent': 'JSTweetMap',
    'Accept-Encoding': 'gzip'
  },
  bufferType: 'buffer'
};

var twApi= module.exports = {};

// Get tweet stream and filter it
twApi.get = function(req, res, auth) {
  options.headers.Authorization = auth;
  stream.get(options, function (error, result) {
    if (error) {
      console.error(error);
    } else {
      res.json(filter(JSON.parse(result.buffer).statuses));
    }
  });
};
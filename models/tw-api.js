// Worker used to retrieve the tweets and filter the obtained data
var stream = require('http-get');
var filter = require('../services/tw-api-filter.js');

var twApi= module.exports = {};

// Set-up url and headers
var options = {
  url: 'https://api.twitter.com/1.1/search/tweets.json?q=girls&result_type=recent&count=100',
  headers: {
    'Host': 'api.twitter.com',
    'User-Agent': 'JSTweetMap',
    'Accept-Encoding': 'gzip'
  },
  bufferType: 'buffer'
};

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
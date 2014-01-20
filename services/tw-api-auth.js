// Worker used to get the OAuth Token from the Twitter API
var request = require('request');
var q = require('q');

module.exports = function(userObj) {

  var reqToken = new Buffer(userObj.appKey + ':' + userObj.appSecret).toString('base64');

  var options = {
    url: 'https://api.twitter.com/oauth2/token',
    headers: {
      Authorization: 'Basic ' + reqToken,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: 'grant_type=client_credentials'
  }

  var deferred = q.defer();

  request.post(options, function(err, res, body) {
    if (err) deferred.reject(err);
    else {
      var resToken = JSON.parse(body).access_token;
      deferred.resolve(resToken);
    }
  });

  return deferred.promise;
};
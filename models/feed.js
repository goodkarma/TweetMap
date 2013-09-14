var redis = require('redis');
var q = require('q');

var db = redis.createClient();

var dbPrefix = global.dbPrefix; // Set what Redis db prefix to use, based on environment (dev or production)
var feedPrefix = dbPrefix + ':feed:';

var feed = module.exports = {};

feed.get = function(id) {
  var feedKey = feedPrefix + id;
  var deferred = q.defer();
  db.lrange(feedKey, 0, 14, function(err, reply) {
    if (err) deferred.reject(err);
    else {
      for (var i = 0; i < reply.length; i++) {
        reply[i] = JSON.parse(reply[i]);
      }
      deferred.resolve(reply);
    }
  });
  return deferred.promise;
};

feed.store = function(id, feedArr) {
  var feedKey = feedPrefix + id;
  feedArr.reverse();
  for (var i = 0; i < feedArr.length; i++) {
    db.lpush(feedKey, JSON.stringify(feedArr[i]));
  }
  db.ltrim(feedKey, 0, 14);
};

feed.delete = function(id) {
  var feedKey = feedPrefix + id;
  db.del(feedKey);
};
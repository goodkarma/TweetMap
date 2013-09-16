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
      for (var i = 0, len = reply.length; i < len; i++) {
        reply[i] = JSON.parse(reply[i]);
      }
      deferred.resolve(reply);
    }
  });
  return deferred.promise;
};

feed.store = function(id, feedArr) {
  var multi = db.multi();
  var feedKey = feedPrefix + id;
  // Keep the right chronological order
  feedArr.reverse();
  // If there's already a feed, generate a map of the contained
  // tweet ids, to avoid storing (and displaying) duplicates
  db.lrange(feedKey, 0, 14, function(err, reply) {
    if (reply.length !== 0) {
      var idMap = {};
      for (var i = 0; i < reply.length; i++) {
        idMap[JSON.parse(reply[i]).id] = 1;
      }
      checkAndStore(feedArr, idMap);
    } else {
      checkAndStore(feedArr);
    }
  });
  function checkAndStore(feedArr, idMap) {
    if (idMap) {
      for (var i = 0; i < feedArr.length; i++) {
        if (!idMap[feedArr[i].id]) {
          multi.lpush(feedKey, JSON.stringify(feedArr[i]));
        }
      }
    } else {
      for (var i = 0; i < feedArr.length; i++) {
        multi.lpush(feedKey, JSON.stringify(feedArr[i]));
      }
    }
    multi.ltrim(feedKey, 0, 14);
    multi.exec();
  }
};

feed.delete = function(id) {
  var feedKey = feedPrefix + id;
  db.del(feedKey);
};
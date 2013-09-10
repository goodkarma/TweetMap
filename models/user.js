var redis = require('redis');
var db = redis.createClient();

var dbN = global.dbName; // Set what Redis db prefix to use, based on environment (dev or production)

var user = module.exports = {};

user.getFeed = function (id) {
  var feedArr = dbN + ':feed:' + id;
  db.lrange(feedArr, 0, 14);
  return db.ltrim(feedArr, 0, 14);
};

user.checkTimer = function (id) {
  var timerKey = dbN + ':timer:' + id;
  return db.ttl(timerKey);
};

user.startTimer = function (id) {
  var timerKey = dbN + ':timer:' + id;
  db.setex(timerKey, 900, 1);
};

user.store = function (id, email, hashWord) {
  var userObj = dbN + ':user:' + id;
  db.hmset(userObj, "id", id, "email", email, "hashWord", hashWord);
};

user.delete = function (id) {
  var userObj = dbN + ':user:' + id;
  var feedArr = dbN + ':feed:' + id;
  var timerKey = dbN + ':timer:' + id;
  db.del(userObj, feedArr, timerKey);
};
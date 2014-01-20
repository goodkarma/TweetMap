var redis = require('redis');
var q = require('q');

var db = redis.createClient();

var dbPrefix = global.dbPrefix; // Set what Redis db prefix to use, based on environment (dev or production)
var userPrefix = dbPrefix + ':user:';
var timerPrefix = dbPrefix + ':timer:';
var idPrefix = dbPrefix + ':id_counter';

var user = module.exports = {};

user.newId = function() {
  var deferred = q.defer();
  db.incr(idPrefix, function(err, reply) {
    if (err) deferred.reject(err);
    else deferred.resolve(reply);
  });
  return deferred.promise;
};

user.exists = function(id) {
  var userKey = userPrefix + id;
  var deferred = q.defer();
  db.exists(userKey, function(err, reply) {
    if (err) deferred.reject(err);
    else deferred.resolve(reply);
  });
  return deferred.promise;
};

user.get = function(id) {
  var userKey = userPrefix + id;
  var deferred = q.defer();
  db.hgetall(userKey, function(err, reply) {
    if (err) deferred.reject(err);
    else deferred.resolve(reply);
  });
  return deferred.promise;
};

user.store = function(id, userObj) {
  var userKey = userPrefix + id;
  db.hmset(userKey, userObj);
};

user.delete = function(id) {
  var userKey = userPrefix + id;
  db.del(userKey);
};

user.checkTimer = function(id) {
  var timerKey = timerPrefix + id;
  var deferred = q.defer();
  db.get(timerKey, function(err, reply) {
    if (err) deferred.reject(err);
    else deferred.resolve(reply);
  });
  return deferred.promise;
};

user.setTimer = function(id) {
  var timerKey = timerPrefix + id;
  var deferred = q.defer();
  db.setex(timerKey, 900, 1, function(err, reply) {
    if (err) deferred.reject(err);
    else deferred.resolve(reply);
  });
  return deferred.promise;
};
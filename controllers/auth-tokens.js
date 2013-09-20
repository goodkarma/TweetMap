var user = require('../models/user.js');
var apiAuth = require('../services/tw-api-auth.js');

module.exports = function(req, res) {
  var id = req.params.id;
  user.get(id).then(
    function(reply) {
      apiAuth(reply).then(
        function(reply) {
          if (reply) {
            user.store(id, {authToken: 'Bearer ' + reply});
            res.send('1');
          } else {
            res.send('0');
          }
        }
      );
    },
    function(err) {
      console.log(err);
    }
  );
};
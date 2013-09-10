var path = require('path');
var fs = require('fs');

module.exports = function (req, res) {
  var email = req.body.email + '\n';
  fs.appendFile(path.join(__dirname, '../pre-register.txt'), email, function() {
    res.redirect('/');
  });
};
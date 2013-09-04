var cors = module.exports = {};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds
};

cors.approve = function (req, res) {
  res.set(defaultCorsHeaders);
};
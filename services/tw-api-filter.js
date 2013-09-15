// Helper to filter the data retrieved from the Twitter API
module.exports = function filter(data) {
  var result = [];
  var baseUrl = 'http://www.twitter.com/';
  for (var i = 0, len = data.length; i < len; i++) {
    // Flag to check if geo data is present and where
    var geoFlag = false;
    if (data[i]['geo']) {
      geoFlag = 1;
    } else if (data[i]['user']['location'].match(/^-?\d+\.\d+$/)) {
      geoFlag = 2;
    } else if (data[i].hasOwnProperty('retweeted_status') && data[i]['retweeted_status'].hasOwnProperty('user') && data[i]['retweeted_status']['user']['location'].match(/^-?\d+\.\d+$/)) {
      geoFlag = 3;
    }
    // If geo data is present
    if (geoFlag) {
      // Initialize result data
      n = result.length;
      result.push({});
      result[n]['geo'] = {};
      var lat, lon;
      var tempLoc;
      var currentYear = new Date().getFullYear();
      var date = data[i]['created_at'].split(' ');
      var tempDate = [];
      // Store geo data
      if (geoFlag === 1) {
        result[n]['geo'] = data[i]['geo']['coordinates'].toString();
      } else if (geoFlag === 2) {
        result[n]['geo'] = data[i]['user']['location'];
      } else {
        result[n]['geo'] = data[i]['retweeted_status']['user']['location'];
      }
      // Store tweet text
      result[n]['text'] = data[i]['text'];
      // Store tweet url
      result[n]['link'] = baseUrl + data[i]['user']['screen_name'] + '/statuses/' + data[i]['id_str'];
      // Prepare creation date
      if (date[2][0] === '0') {
        date[2] = date[2].slice(1);
      }
      tempDate[0] = date[2];
      tempDate[1] = date[1];
      date[date.length-1] != currentYear && (tempDate[2] = date[date.length-1]);
      // Store creation date
      result[n]['date'] = tempDate.join(' ');
      // Store author name
      result[n]['name'] = data[i]['user']['name'];
      // Store author username
      result[n]['username'] = data[i]['user']['screen_name'];
      // Store profile image
      result[n]['profileImage'] = data[i]['user']['profile_image_url'];
    }
  }
  return result;
}
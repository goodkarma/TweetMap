$(function() {
  $.getScript('//cdnjs.cloudflare.com/ajax/libs/leaflet/0.6.4/leaflet.js', function() {

    var tweetTemplate;
    var preLoad = {};

    var map = L.map('map').setView([37.775, -122.4183], 2);
    L.tileLayer("http://{s}tile.stamen.com/toner/{z}/{x}/{y}.png", {minZoom: 0,maxZoom: 20,subdomains: ["", "a.", "b.", "c.", "d."],scheme: "xyz"}).addTo(map)
    document.getElementsByClassName('leaflet-control-attribution')[0].innerHTML = '<a href="http://tweetmap.goodkarma.net" target="_blank" title="Tweet Map">TweetMap</a> - Powered by <a href="http://leafletjs.com" target="_blank" title="Leaflet">Leaflet</a>';

    $.ajax({
      url: 'http://localhost:3000/tweet-template',
      success: function(data) {
        tweetTemplate = data;
      }
    })

    function getTweets() {
      $.get('http://localhost:3000/feed?id=1', function(tweetsArr) {
        showTweets(tweetsArr);
      });
    }

    function showTweets(tweetsArr) {
      var len = tweetsArr.length;
      var count = 0;

      // Pre-load images
      for (var i = 0; i < tweetsArr.length; i++) {
        preLoad[i] = new Image().src = tweetsArr[i]['profileImage'];
      }

      function placeTweet(tweet) {
        if (count < len) {
          var tweetHtml = Hogan.compile(tweetTemplate);
          var marker1 = L.marker([tweet.geo.lat, tweet.geo.lon]).addTo(map).bindPopup(tweetHtml.render(tweet)).openPopup();
          count++;
          setTimeout(function() {
            map.removeLayer(marker1);
            placeTweet(tweetsArr[count]);
          }, 6000);
        } else {
          getTweets();
        }
      }
      placeTweet(tweetsArr[count]);
    }

    getTweets();

  });
});

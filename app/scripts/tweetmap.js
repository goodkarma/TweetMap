$(function() {
  $.getScript('//cdnjs.cloudflare.com/ajax/libs/leaflet/0.6.4/leaflet.js', function() {

    var tweetTemplate;
    var preLoad = {};
    var errorCount = 0;
    var errorMsg = "TweetMap error - The Twitter API doesn't return any tweet for your query string";

    var map = L.map('map').setView([37.775, -122.4183], 2);
    // // Black and white map
    L.tileLayer("http://{s}tile.stamen.com/toner/{z}/{x}/{y}.png", {minZoom: 0,maxZoom: 20,subdomains: ["", "a.", "b.", "c.", "d."],scheme: "xyz"}).addTo(map)
    document.getElementsByClassName('leaflet-control-attribution')[0].innerHTML = '<a href="http://tweetmap.goodkarma.net" target="_blank" title="Tweet Map">TweetMap</a> - Powered by <a href="http://leafletjs.com" target="_blank" title="Leaflet">Leaflet</a>';

    // // Standard map
    // L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {maxZoom: 18}).addTo(map);
    // document.getElementsByClassName('leaflet-control-attribution')[0].innerHTML = '<a href="http://tweetmap.goodkarma.net" target="_blank" title="Tweet Map">TweetMap</a> - Powered by <a href="http://leafletjs.com" target="_blank" title="Leaflet">Leaflet</a>';

    $.ajax({
      url: '/tweet-template',
      success: function(data) {
        tweetTemplate = data;
      }
    })

    function getTweets() {
      $.get('/feed/1', function(tweetsArr) {
        showTweets(tweetsArr);
      });
    }

    function showTweets(tweetsArr) {
      var len = tweetsArr.length;
      var count = 0;

      len === 0 && errorCount++;

      // Pre-load images
      for (var i = 0; i < tweetsArr.length; i++) {
        preLoad[i] = new Image().src = tweetsArr[i]['profileImage'];
      }

      function placeTweet(tweet) {
        if (count < len) {
          var tweetHtml = Hogan.compile(tweetTemplate);
          var marker1 = L.marker(tweet.geo.split(',')).addTo(map).bindPopup(tweetHtml.render(tweet)).openPopup();
          count++;
          setTimeout(function() {
            map.removeLayer(marker1);
            placeTweet(tweetsArr[count]);
          }, 6000);
        } else {
          errorCount < 3 ? getTweets() : console.log(errorMsg);
        }
      }
      placeTweet(tweetsArr[count]);
    }

    getTweets();

  });
});

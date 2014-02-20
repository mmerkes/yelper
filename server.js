var yelpKeys = require('./private/yelpConfig')

var yelp = require("./lib/yelp").createClient( yelpKeys );

// See http://www.yelp.com/developers/documentation/v2/search_api
yelp.search({term: "food", location: "Montreal"}, function(error, data) {
  console.log(error);
  console.log(data);
  console.log('========================================================');
});

// See http://www.yelp.com/developers/documentation/v2/business
yelp.business("yelp-san-francisco", function(error, data) {
  console.log(error);
  console.log(data);
});





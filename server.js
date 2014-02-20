var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

// Change this to point at the keys for your yelp config file
var yelpKeys = require('./private/yelpConfig')
var yelp = require("./lib/yelp").createClient( yelpKeys );

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*
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
*/

// Handle the request to search for places
app.get('/api/search', function( request, response ) {
  yelp.search( buildYelpQuery(request.query), function(error, data) {
    if( error )
      console.log(error);
    response.send(data);
    response.end();
  });
});

// Handle the request for a specific business
app.get('/api/business/:id', function( request, response ) {
  yelp.business( request.params.id, function( error, data ) {
    if( error )
      console.log(error);
    response.send(data);
    response.end();
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/*
General Search Parameters

term: string
limit: number
offset: number
sort: number
category_filter: string
radius_filter: number
deals_filter: bool
*/

function buildYelpQuery( query ) {
  var query_set = {};

  if(query.term)
    query_set['term'] = query.term;
  if(query.limit)
    query_set['limit'] = query.limit;
  if(query.offset)
    query_set['offset'] = query.offset;
  if(query.sort)
    query_set['sort'] = query.sort;
  if(query.category_filter)
    query_set['category_filter'] = query.category_filter;
  if(query.radius_filter)
    query_set['radius_filter'] = query.radius_filter;
  if(query.deals_filter)
    query_set['deals_filter'] = query.deals_filter;

  // Location params
  if(query.location)
    query_set['location'] = query.location;

  return query_set;
}




var twitterKeys = require("./keys.js");
var request = require("request");
var Twitter = require('twitter');

var commands = process.argv[2];

switch (commands) {
    case "my-tweets":
        tweets();
        break;

    case "spotify-this-song":
        spotify();
        break;

    case "movie-this":
        movie();
        break;

    case "do-what-it-says":
        says();
        break;
}

function movie() {
	var movieName = "";
	var nodeArgs = process.argv;
	
	if (nodeArgs.length == 3) {
		// no input given, default to movie Mr. Nobody
		movieName = "Mr.+Nobody";
	} else {
		for (var i = 3; i < nodeArgs.length; i++) {
			if (i == 3) {
				movieName = nodeArgs[i];
			} else {
				movieName += "+" + nodeArgs[i];
			}
		}
	}

	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
	console.log(queryUrl);

	request(queryUrl, function(error, response, body) {
		if (!error && response.statusCode === 200) {
    		console.log("Title of the movie: " + JSON.parse(body).Title);
    		console.log("Year the movie came out: " + JSON.parse(body).Year);
    		console.log("IMDB Rating of the movie: " + JSON.parse(body).imdbRating);
    		for (var i = 0; i < JSON.parse(body).Ratings.length; i++) {
   				var rating = JSON.parse(body).Ratings[i];
   				if (rating.Source == "Rotten Tomatoes") {
   					console.log("Rotten Tomatoes Rating of the movie: " + rating.Value);
   				} 
    		}
    		console.log("Country where the movie was produced: " + JSON.parse(body).Country);
    		console.log("Language of the movie: " + JSON.parse(body).Language);
    		console.log("Plot of the movie: " + JSON.parse(body).Plot);
    		console.log("Actors in the movie: " + JSON.parse(body).Actors);
  		}
	});
}

function tweets() {
	var client = new Twitter({
	  consumer_key: twitterKeys.consumer_key,
	  consumer_secret: twitterKeys.consumer_secret ,
	  access_token_key: twitterKeys.access_token_key,
	  access_token_secret: twitterKeys.access_token_secret
	});
	var params = {screen_name: 'maggieBerkeley'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
  		if (!error) {
    		// console.log(tweets);
    		for (var i = 0; i < tweets.length; i++) {
    			console.log(tweets[i].text + " (" + tweets[i].created_at + ")");
    		}
  		} else {
  			console.log(error);
  		}
	});
}
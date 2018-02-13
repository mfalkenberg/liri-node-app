var keys = require("./keys.js");
var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require("fs");
var commands = process.argv[2];
const opn = require('opn');

switch (commands) {
    case "my-tweets":
        tweets();
        break;

    case "spotify-this-song":
        spotify(process.argv);
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
	// https://www.npmjs.com/package/twitter
	var client = new Twitter({
	  consumer_key: keys.twitter.consumer_key,
	  consumer_secret: keys.twitter.consumer_secret ,
	  access_token_key: keys.twitter.access_token_key,
	  access_token_secret: keys.twitter.access_token_secret
	});
	var params = {screen_name: 'maggieBerkeley'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
  		if (!error) {
    		for (var i = 0; i < tweets.length; i++) {
    			console.log(tweets[i].text + " (" + tweets[i].created_at + ")");
    		}
  		} else {
  			console.log(error);
  		}
	});
}

function spotify(nodeArgs) {
  var spotify = new Spotify({
    id: keys.spotify.client_id,
    secret: keys.spotify.client_secret
  });

  var song = "";

  if (nodeArgs.length <= 3) {
    // no input given, default to movie Mr. Nobody
    song = "The+Sign+Ace+of+Base";
  } else {
    for (var i = 3; i < nodeArgs.length; i++) {
      if (i == 3) {
        song = nodeArgs[i];
      } else {
        song += "+" + nodeArgs[i];
      }
    }
  }
 
  spotify.search({ type: 'track', query: song}, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    
    for (var i = 0; i < data.tracks.items.length; i++) {
          console.log("🦄 " + data.tracks.items[i].artists[0].name + " - " + data.tracks.items[i].name);
          console.log("🎧 Album: " + data.tracks.items[i].album.name);
          console.log("🌍 Preview-url: " + data.tracks.items[i].preview_url);
          console.log("--------------------------------------------------------"); 
    }

    //open the preview in the local browser, only tested on Mac :)
    opn(data.tracks.items[0].preview_url, {wait: false});
  });
}

function says(){
  fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(data);
        // spotify-this-song,"I Want it That Way"

        // // Break down all the numbers inside
        data = data.split(",");
         console.log(data);

        switch (data[0]) {
          case "my-tweets":
              tweets();
              break;

          case "spotify-this-song":
              // create a pseudo argv to avoid
              // process.argv[3] = data[1];
              var pseudoArgv = ["", "", "", data[1]];
              spotify(pseudoArgv);
              break;

          case "movie-this":
              movie();
              break;

          case "do-what-it-says":
              says();
              break;
        }
    });
}
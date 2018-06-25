 /* ************************** GLOBAL VARIABLES ************************** */
     //To read and set any environment variables with the dotenv package
     require("dotenv").config();
    
    // To require keys file
    var keys = require ("./keys.js");


     // To store command line arguments and store them into a variable
    var type_search = process.argv.slice(3).join(" ");
    //console.log(type_search);

/* ****************************** FUNCTIONS ****************************** */
    //Function to save the executed command into log.txt
    var logText = function (commandtext, text) {
        var fs = require("fs");
        // To separate search result from commnand line
        var divider = "\n------------------------------------------------------------\n\n";
        fs.appendFile("log.txt","Executed command: " + commandtext+"\n\n"+ "Results: \n\n"+ text + divider, function(err) {
            if (err) throw err;
        });
    };

    var Spotify = function (song) {
        //To require spotify api
        var Spotify = require('node-spotify-api');
        
        var spotify = new Spotify(keys.spotify);
        //Condition if user does not provide a song name
        if (song === "") {
            var song = "The Sign";
            spotify
            .search({ type: 'track', query: song })
            .then(function(response) {
               
                    var write_text = [
                         //* Artist(s)
                        "The artist is:  " + response.tracks.items[5].album.artists[0].name,
                        //* The song's name
                        "The song's name:" + response.tracks.items[5].name,
                        //* A preview link of the song from Spotify
                        "The preview link: " + response.tracks.items[5].external_urls.spotify,
                        //* The album that the song is from
                        "The album's name: " + response.tracks.items[5].album.name,
                    ].join("\n\n");
                    var commandtext = "spotify-this-song";
                    console.log("===========================");
                    console.log(write_text);
                    logText(commandtext,write_text);
            })
            .catch(function(err) {
                console.log(err);
            });
        }
        //Condition if user provides a song name
        else {
            spotify
                .search({ type: 'track', query: song })
                .then(function(response) {
                    //console.log(JSON.stringify(response));
                     var write_text = [
                        //* Artist(s)
                        "The artist is:  " + response.tracks.items[0].album.artists[0].name,
                        //* The song's name
                        "The song's name: " + response.tracks.items[0].name,
                        //* A preview link of the song from Spotify
                        "The preview link: " + response.tracks.items[0].external_urls.spotify,
                        //* The album that the song is from
                        "The album's name: " + response.tracks.items[0].album.name,
                    ].join("\n\n");
                    
                    //To send the command if user uses the "do what it says" command in git
                    if (song === '"I Want it That Way"') {
                        var commandtext = "do-what-it-says";
                    }
                    else {
                        var commandtext = "spotify-this-song" + " " +song;
                    }
                    console.log("===========================");
                    console.log(write_text);
                    logText(commandtext,write_text);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
        }
    };

    var Twitter = function () {
        //to require twitter package
        var Twitter = require('twitter');
        var client = new Twitter(keys.twitter);
        client.get('statuses/user_timeline', function(error, tweets, response) {
            if (!error) {
                //console.log(JSON.stringify(tweets));
                var counter = 1;

                for (var i=0; i < 20; i++) {
            
                    var write_text = [         
                        "Tweet #"+ counter,
                        //Created date
                        "Created date: "+ tweets[i].created_at,
                         //Tweet text
                        "Text: "+ tweets[i].text
                    ].join("\n\n");
                    counter++;
                    var commandtext = "my-tweets";
                    console.log("===========================");
                    console.log(write_text);
                    logText(commandtext,write_text);
                }
            }
        });

    };

    var Movie = function (movie) {
        var request = require('request');
        //If user does not provide movie title
        if (movie === "") {
            var movie = "Mr. Nobody";
        }

        var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy"
        request(queryURL, function (error, response, body) {
        //console.log('error:', error); // Print the error if one occurred
        
        //console.log('body:', body); // Print the HTML for the Google homepage.
            if (response.statusCode == 200) {
                var bodyObj = JSON.parse(body);
                var write_text = [  
                    //* Title of the movie.
                        "Title: "+ bodyObj.Title,
                    //* Year the movie came out.
                        "Year: "+ bodyObj.Year,
                    //* IMDB Rating of the movie.
                        "IMDB Rating: "+ bodyObj.imdbRating,
                    //* Rotten Tomatoes Rating of the movie.
                        "Rotten Tomatoes: "+ bodyObj.Ratings[1].Value,
                    //* Country where the movie was produced.
                        "Country: "+ bodyObj.Country,
                    //* Language of the movie.
                        "Language: "+ bodyObj.Language,
                    //* Plot of the movie.
                        "Plot: "+ bodyObj.Plot,
                    //* Actors in the movie.
                        "Actors: "+ bodyObj.Actors
                ].join("\n\n");
                var commandtext = "movie-this" + movie;
                console.log("===========================");
                console.log(write_text);
                logText(commandtext,write_text);
            }
            else {
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            }
        });


      
    };

    var DoThis = function () {
        //NPM package to read files
        var fs = require("fs");

        fs.readFile("random.txt", "utf8", function(error, data) {
            // If the code experiences any errors it will log the error to the console.
            if (error) {
                return console.log(error);
            }
            // Split response by commas (to make it more readable)
            var dataArr = data.split(",");
            //Call function with text to search
            Spotify(dataArr[1]);
        });
    };




/* ******************************** CALLS ******************************** */

    switch(process.argv[2]) {
        case "my-tweets":
            Twitter();
            break;
        case "spotify-this-song":
            Spotify(type_search);
            break;
        case "movie-this":
            Movie(type_search);
            break;
        case "do-what-it-says":
            DoThis();
            break;
        default:
            console.log("Oops! unfortunately, that is an invalid option, please try again!");
    }
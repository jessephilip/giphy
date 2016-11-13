// ---------- TODOS ----------

// ---------- GLOBAL VARIABLES ----------

// array of interested subjects
var items = ["fall", "slide", "trip", "slip", "wreck", "belly flop", "crash", "jump", "catch", "swing", "throw", "toss", "punch", "kick", "stretch", "parkour", "laugh", "dive", "skip", "dance", "push", "balance", "flip", "skate", "climb", "hang", "break", "fail"];

// ---------- LOCATIONS ----------
var buttonSection = $("#buttonSection");
var imageSection = $("#imageSection");
var searchField = $("#searchField");
var searchRadio = $("#searchRadio");
var randomRadio = $("#randomRadio");

// ---------- URL TAGS FOR AJAX ----------

// search query term or phrase
var searchTag = "&q=";

// number of results to return, maximum 100. Default 25.
var limitTag = "&limit=";

// rating - (optional) limit results to those rated (y,g, pg, pg-13 or r). for all URLs
var ratingTag = "&rating=";

// the format to return the object. for all URLS.
var formatTag = "&fmt=json";

//the tag term. for random.
var tagTag = "&tag=";

// the public api key. for all URLS
var apiKeyTag = "&api_key=dc6zaTOxFJmzC";

// combined URL phrases for searches

var searchURL = "http://api.giphy.com/v1/gifs/search?" + apiKeyTag + formatTag;

// returns top 25 giphys
var trendingURL = "http://api.giphy.com/v1/gifs/trending?" + apiKeyTag + formatTag;

//generates a random giphy. can add a tag to the request to get a random giphy in that area
var randomURL = "http://api.giphy.com/v1/gifs/random?" + apiKeyTag + formatTag;

// ---------- CLICKLISTENERS ----------

// this click listener handles the giphy buttons at the top of the page
$(document).on("click", ".giphyButtons", clickMe);
$(document).on("click", "#searchButton", getSearchTerm);
searchRadio.on("click", function() {
	searchRadio.prop("checked", true);
	randomRadio.prop('checked', false);

});

randomRadio.on("click", function() {
	randomRadio.prop("checked", true);
	searchRadio.prop("checked", false);

});


// ---------- FUNCTIONS ----------

// this function handles the click event for the giphy buttons at the top of the page
function clickMe() {

    // the value of the clicked button
    var searchTerm = $(this).val();

    // perform ajax search
    search(searchTerm);

}

// this function gets the value of the user's search term
function getSearchTerm(e) {
    e.preventDefault();

    var searchTerm = searchField.val().trim();
    if (searchTerm.length > 0) createButton(searchTerm);

    if (searchRadio.prop("checked")) {
    	console.log("search");
    	search(searchTerm);
    }
    else {
    	console.log("random");
    	randomGiphy(searchTerm);
    }

    // clear #searchField
    searchField.val("");

}

//this function sets the checked property of the radio buttons
function selectRadio() {
	var selection = $(this).val() + "Radio";
	console.log(selection);

	$(".circles").prop("checked", false);
	selection.prop("checked", true);

}

// this function creates a singular button from the string passed to it
function createButton(name) {

    items.push(name);
    buttonSection.empty();

    for (var i = 0; i < items.length; i++) {
        var button = $("<button>");
        button.addClass("btn btn-primary giphyButtons");
        button.text(items[i]);
        button.val(items[i]);
        buttonSection.append(button);
    }

}

// this function performs an ajax call to giphy and returns search results
function search(search) {
    $.ajax({
            url: searchURL + searchTag + search + limitTag + 9,
            type: "GET",
            dataType: "json"
        })
        .done(function(object) {
            console.log(object);

            imageSection.empty();

            for (var i = 0; i < object.data.length; i++) {
                if (i % 3 == 0) {
                    var row = $("<div class='row'>");
                    row.attr("id", "row" + i);
                    imageSection.append(row);
                }

                var div = $("<div>");
                div.addClass('col-xs-3');
                row.append(div);

                var h4 = $("<h4>");
                h4.text("Rating: " + object.data[i].rating.toUpperCase());
                div.append(h4);

                var image = $("<img>");
                image.attr("src", object.data[i].images.fixed_height_downsampled.url);
                //image.attr("src", object.data[i].images.fixed_height_small.url);
                image.attr("alt", "searchTerm");
                image.addClass('img-responsive');
                div.append(image);

            }

        });
}

function randomGiphy(random) {
	$.ajax({
            url: randomURL + tagTag + random,
            type: "GET",
            dataType: "json"
        })
        .done(function(object) {
            console.log(object);

            imageSection.empty();

            for (var i = 0; i < object.data.length; i++) {
                if (i % 3 == 0) {
                    var row = $("<div class='row'>");
                    row.attr("id", "row" + i);
                    imageSection.append(row);
                }

                var div = $("<div>");
                div.addClass('col-xs-3');
                row.append(div);

                var h4 = $("<h4>");
                h4.text("Rating: " + object.data[i].rating.toUpperCase());
                div.append(h4);

                var image = $("<img>");
                image.attr("src", object.data[i].images.fixed_height_downsampled.url);
                //image.attr("src", object.data[i].images.fixed_height_small.url);
                image.attr("alt", "searchTerm");
                image.addClass('img-responsive');
                div.append(image);

            }

        });

}

// this function sets the page up and is to be run at startup
// create buttons across the top of the page
function start() {
    for (var i = 0; i < items.length; i++) {
        var button = $("<button>");
        button.addClass("btn btn-primary giphyButtons");
        button.text(items[i]);
        button.val(items[i]);
        buttonSection.append(button);
    }
}

//---------- STARTUP CODE ----------
start();

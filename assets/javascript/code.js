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

// ---------- SELECTORS ----------
var primaryButtons = $(".giphyButtons");

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

var searchURL = "https://api.giphy.com/v1/gifs/search?" + apiKeyTag + formatTag;

// returns top 25 giphys
var trendingURL = "https://api.giphy.com/v1/gifs/trending?" + apiKeyTag + formatTag;

//generates a random giphy. can add a tag to the request to get a random giphy in that area
var randomURL = "https://api.giphy.com/v1/gifs/random?" + apiKeyTag + formatTag;

//giphy search by giphy id
var idURL = "https://api.giphy.com/v1/gifs/";

// ---------- CLICKLISTENERS ----------

// this click listener handles the giphy buttons at the top of the page
$(document).on("click", ".giphyButtons", clickMe);

// this clicklistener toggles the on/off for gifs
$(document).on("click", ".giphyImage", toggleGiphy);

// this clicklistener handles the submit button
$(document).on("click", "#searchButton", getSearchTerm);

// clicklistener for the search radio button. toggles checked property
searchRadio.on("click", function() {
    searchRadio.prop("checked", true);
    randomRadio.prop('checked', false);

});

// clicklistener for the random radio button. toggles checked property
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

    // check to make sure #searchField is not empty. Do not create a button for random searches
    if (searchTerm.length > 0 && !($("#randomRadio").prop("checked"))) createButton(searchTerm);

    // handles which radio button is checked. run search if checked, otherwise random
    if (searchRadio.prop("checked")) {

        // run search query
        search(searchTerm);

        // clear #searchField
        searchField.val("");
    } else {

        // run random query and do not clear the searchField
        randomGiphy(searchTerm);
    }

}

// this function is used to add a button at the top. string passed to it is the name of the button.
function createButton(name) {

    items.push(name);
    buttonSection.empty();

    for (var i = 0; i < items.length; i++) {
        var button = $("<button>");
        button.addClass("btn btn-primary giphyButtons hvr-glow");
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

                // create div for bootstrap tidyness
                var div = $("<div>");
                div.addClass('col-xs-3');
                row.append(div);

                // holds the rating text for the giphy
                var h4 = $("<h4>");
                h4.text("Rating: " + object.data[i].rating.toUpperCase());
                div.append(h4);

                // img for the gif or still image
                var image = $("<img>");
                image.attr("src", object.data[i].images.downsized.url);
                image.attr("alt", "searchTerm");

                // make the url to the still image a data attribute
                image.data("still", object.data[i].images.downsized_still.url);

                // make the url to the gif image a data attribute
                image.data("giphy", object.data[i].images.downsized.url);

                // make the toggle status to the still image a data attribute
                image.data("toggle", true);
                image.addClass('img-responsive giphyImage');
                div.append(image);

            }

        });
}

// this function uses the random url to get one random picture. it
// this function performs two ajax requests because the request for a random gif does not return a rating for that gif
function randomGiphy(random) {
    $.ajax({
            url: randomURL + tagTag + random,
            type: "GET",
            dataType: "json"
        })
        .done(function(randomObject) {

            // variable to hold the specific id of the randomly generated gif
            var id = randomObject.data.id;

            // begin second ajax call with specific id
            $.ajax({
                    url: idURL + id + "?" + apiKeyTag,
                    type: 'GET',
                    dataType: 'json',
                })
                .done(function(idObject) {
                    console.log(idObject);

                    // empty any previous pictures on the page
                    imageSection.empty();

                    // div for bootstrap tidyness
                    var row = $("<div class='row'>");
                    imageSection.append(row);

                    // div for bootstrap tidyness. if the gif is very large, it will go under the search box. this is intentional.
                    var div = $("<div>");
                    div.addClass('col-xs-12');
                    row.append(div);

                    // holds the rating of the gif
                    var h4 = $("<h4>");
                    h4.text("Rating: " + idObject.data.rating.toUpperCase());
                    div.append(h4);

                    // holds the gif or still
                    var image = $("<img>");
                    image.attr("src", idObject.data.images.original.url);
                    image.attr("alt", "searchTerm");
                    image.addClass('img-responsive giphyImage');

                    // make the url to the still image a data attribute
                    image.data("still", idObject.data.images.original_still.url);

                    // make the url to the gif image a data attribute
                    image.data("giphy", idObject.data.images.original.url);

                    // make the toggle status to the still image a data attribute
                    image.data("toggle", true);
                    div.append(image);

                });

        });

}

// this function toggles the giphy to start and stop
function toggleGiphy() {

    // get still image
    var still = $(this).data("still");

    // get gif image
    var giphy = $(this).data("giphy");

    // get toggle status
    var toggle = $(this).data("toggle");

    // if image moving, replace the image with a still. otherwise, replace the still with the gif
    if (toggle) {
        $(this).attr("src", still);
        $(this).data("toggle", false);
    } else {
        $(this).attr("src", giphy);
        $(this).data("toggle", true);
    }
}

// this function sets the page up and is to be run at startup
// create buttons across the top of the page
function start() {
    for (var i = 0; i < items.length; i++) {
        var button = $("<button>");
        button.addClass("btn btn-primary giphyButtons hvr-glow");
        button.text(items[i]);
        button.val(items[i]);
        buttonSection.append(button);
    }
}

//---------- STARTUP CODE ----------
start();

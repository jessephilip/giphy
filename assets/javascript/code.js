// ---------- TODOS ----------

// ---------- GLOBAL VARIABLES ----------

// array of interested subjects
var items = ["fall", "slide", "trip", "slip", "wreck", "belly flop", "crash", "jump", "catch", "swing", "throw", "toss", "punch", "kick", "stretch", "parkour", "laugh", "dive", "skip", "dance", "push", "balance", "flip", "skate", "climb", "hang", "break", "fail"];

// ---------- LOCATIONS ----------
var buttonSection = $("#buttonSection");
var imageSection = $("#imageSection");

// ---------- URL TAGS FOR AJAX ----------
var searchURL = "http://api.giphy.com/v1/gifs/search?&api_key=dc6zaTOxFJmzC&fmt=json";

// returns top 25 giphys
var trendingURL = "http://api.giphy.com/v1/gifs/trending?&api_key=dc6zaTOxFJmzC&fmt=json";

//generates a random giphy. can add a tag to the request to get a random giphy in that area
var randomURL = "http://api.giphy.com/v1/gifs/random?&api_key=dc6zaTOxFJmzC&fmt=json";

// search query term or phrase
var search = "&q=";

// number of results to return, maximum 100. Default 25.
var limit = "&limit=";

// rating - (optional) limit results to those rated (y,g, pg, pg-13 or r). for all URLs
var rating = "&rating=";

// the format to return the object. for all URLS.
var format = "&fmt=json";

//the tag term. for random.
var tag = "&tag=";

// the public api key. for all URLS
var apiKey = "&api_key=dc6zaTOxFJmzC";

// ---------- CLICKLISTENERS ----------

// this click listener handles the giphy buttons at the top of the page
$(document).on("click", ".giphyButtons", clickMe);

// ---------- FUNCTIONS ----------

// this function handles the click event for the giphy buttons at the top of the page
function clickMe() {

    // the value of the clicked button
    var searchTerm = $(this).val();

    $.ajax({
            url: searchURL + search + searchTerm + limit + 9,
            //url: searchURL + search + searchTerm + (limit + 5),
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
                div.addClass('col-md-3');
                row.append(div);

                var h4 = $("<h4>");
                h4.text(object.data[i].rating);
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

//---------- STARTUP CODE ----------

// create buttons across the top of the page
for (var i = 0; i < items.length; i++) {
    var button = $("<button>");
    button.addClass("btn btn-primary giphyButtons");
    button.text(items[i]);
    button.val(items[i]);
    buttonSection.append(button);
}

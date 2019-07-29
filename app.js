// Creating a function that loads on page load
$(document).ready(function() {

  // Creating variable: array w/ all existing animal types
  var animals = [
    "dog", "cat", "rabbit", "hamster", "skunk", "goldfish",
    "bird", "ferret", "turtle", "sugar glider", "chinchilla",
    "hedgehog", "hermit crab", "gerbil", "pygmy goat", "chicken",
    "capybara", "teacup pig", "serval", "salamander", "frog"
  ];

  // Creating a function that will populate html div where our buttons should go
  // This function takes three arguments -- the array to use, the class we are adding, and the area in the html doc that we are adding to
  function populateButtons(arrayToUse, classToAdd, areaToAddTo) {
    //This line uses jQuery to grab the 'areaToAddTo' var and empty it of all content
    $(areaToAddTo).empty();

    //This line introduces a for loop that will loop through whichever array we take in for the function (arrayToUse)
    for (var i = 0; i < arrayToUse.length; i++) {
      //In this line, we declare a variable and set it as a new button element
      var a = $("<button>");
      //in this line, we are giving the newly created button a class, classToAdd, which is determined by user input
      a.addClass(classToAdd);
      //in this line, we are giving our button an attribute -- data type, with a value of the string at array place 'i' 
      a.attr("data-type", arrayToUse[i]);
      //On this line, we are setting the text for the button, which is the string of whatever place i in the array we are at
      a.text(arrayToUse[i]);
      //On this line, we are appending our newly created button to the area to add to div in html
      $(areaToAddTo).append(a);
    }

  }

  //This line is creating a function that is called whenever we click one of the .animal-button classed items
  $(document).on("click", ".animal-button", function() {
    //This line is emptying all html elements with the 'animals' id (our gif divs)
    $("#animals").empty();
    //remove the 'active' class from the animal button class elements (sort of a reset, it seems)
    $(".animal-button").removeClass("active");
    //Add the class 'active' to this, this being the animal button classed items
    $(this).addClass("active");

    //define a new variable, being the value of the data-type attribute for whichever button is being clicked, which is simply the animal of whichever button we are clicking
    var type = $(this).attr("data-type");
    //This line is creating a new variable, the link that we will use to run our api and return gif data. It includes the link, plus a variable section that depends on the 'type' which is the name of our animal linked to that specific button. We are also limiting our results to 10 gifs returned
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + type + "&api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9&limit=10";

    //This line is calling the ajax function
    $.ajax({
      //These lines are where we put in our parameters for the ajax function: the url that we are using in the search (defined above), as well as the type of request we are making to ajax (in this case, a GET request, which returns information to us)
      url: queryURL,
      method: "GET"
    })
    //This is our promise, which runs after the ajax query is successful and contains a callback function that will run as well. This function takes in the 'response' item, which is simply one of many words we can put in that slot to define the name for whatever ajax returns to us
      .then(function(response) {
        //In our callback function, we first define a new variable results as the data from our response.
        var results = response.data;


        //We run a for loop that will let us iterate through all of the received responses (10 per button click) 
        for (var i = 0; i < results.length; i++) {
          //we create a new variable, animalDiv, that is a div element with the class 'animal-item'. The weird quotes in this line could (i assume) be replaced with single quotes and would still work as intended
          var animalDiv = $("<div class=\"animal-item\">");

          // We then create a new variable, rating, that is the rating for whichever individual item iteration we are on
          var rating = results[i].rating;

          //We then create a new variable, p, which is simple a paragraph element with the text describing the rating of whichever item iteration we are on
          var p = $("<p>").text("Rating: " + rating);

          //We then create another two variables that will contain either the url of the unmoving state of the gif, or the moving state of the gif
          var animated = results[i].images.fixed_height.url;
          var still = results[i].images.fixed_height_still.url;

          //We then create another variable, animalImage, which is an empty image tag
          var animalImage = $("<img>");

          //We then apply a bunch of attributes to this image tag -- the initial source for the tag url (defaulted to still), the two data attributes that determine whether or not the gif is moving or still, the data state of the image (which is still by default). Finally, we add a class to our image: animal-image. 
          animalImage.attr("src", still);
          animalImage.attr("data-still", still);
          animalImage.attr("data-animate", animated);
          animalImage.attr("data-state", "still");
          animalImage.addClass("animal-image");

          //We then append our rating paragraph text description AS WELL AS our newly created image element to the  animal div created at the beginning of our function
          animalDiv.append(p);
          animalDiv.append(animalImage);

          // We then append our animal div to the master div section in our html doc that contains all of our gifs
          $("#animals").append(animalDiv);
        }
      });
  });

  //Here we are creating another on-click function that runs whenever we click one of our created animal pictures
  $(document).on("click", ".animal-image", function() {

    // Here, we are creating a variable to define the state of the animal image. It takes in the attribute of the image which we set previously to be 'still' by default
    var state = $(this).attr("data-state");


    //Here, we are creating an if statement saying that, if the state of the image is still when we click it, we change our image source link (which was still by default) to the animated gif link, and then change the state of the image attribute to animate.
    if (state === "still") {
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "animate");
    }
    //The else statement does the opposite of what we defined above
    else {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "still");
    }
  });

  //Here, we are adding another click function that occurs whenever we click our add animals button
  $("#add-animal").on("click", function(event) {
    //Here, we are preventing the page from reloading
    event.preventDefault();
    //Here, we are creating a new variable that consists of the value of item at index 0 of our input (which is just whatever the string is that the user types)
    var newAnimal = $("input").eq(0).val();

    //Here, we are saying that if newAnimal (what the user types into input) is longer than 2 characters, then add it to the animal button array. So no two letter animals allowed I guess :(
    if (newAnimal.length > 2) {
      animals.push(newAnimal);
    }

    //This is running our populate buttons function whenever the add animal button is clicked, which adds all our buttons and labels them and such
    populateButtons(animals, "animal-button", "#animal-buttons");

  });

  //This is running our populateButtons function initially
  populateButtons(animals, "animal-button", "#animal-buttons");
});

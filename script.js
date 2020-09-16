$(document).ready(function () {
  // defining cityArray variable that holds the inputted value
  var cityArray = [];

  /* if the localStorage key "city" does not equal null when trying to receive it, then call
  displayingPreviousSearches */
  if (localStorage.getItem("city") !== null) {
    displayingPreviousSearches();
  }

  // creating click event for the search button
  $("#search-btn").on("click", function (event) {
    event.preventDefault();
    var value = $("#search-field").val();
    if (value !== "") {
      dataPopulation(value);
      cityArray.push(value);
      localStorage.setItem("city", JSON.stringify(cityArray));
      displayingPreviousSearches();
      $("#search-field").val("");
    }
  });

  // creating a function that displays previous searches when called
  function displayingPreviousSearches() {
    cityArray = JSON.parse(localStorage.getItem("city"));
    var cityList = $("#city-list");
    cityList.empty();
    for (var i = 0; i < cityArray.length; i++) {
      var newCity = $("<button>");
      newCity.text(cityArray[i]);
      newCity.attr("class", "newBtn btn btn-info");
      newCity.attr("style", "display: block");
      cityList.append(newCity);
    }
  }

  // creating a function that holds all the AJAX calls used to populate data from the API onto the page
  function dataPopulation(city) {
    $(".col-md-8").attr("style", "display: block");
    var latAndLon = [];

    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appid=8a55540123da427eeafd1557098743c0";

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      $("#city").text(response.name + " (" + moment().format("M/D/YYYY") + ")");
      $("#temp").text("Temperature: " + response.main.temp + " °F");
      $("#humidity").text("Humidity: " + response.main.humidity + "%");
      $("#wind-speed").text("Wind Speed: " + response.wind.speed + " MPH");
      latAndLon.push(response.coord.lat, response.coord.lon);
      uvIndex(latAndLon);
    });

    var queryURLTwo =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&units=imperial&appid=8a55540123da427eeafd1557098743c0";

    $.ajax({
      url: queryURLTwo,
      method: "GET",
    }).then(function (response) {
      $("#forecast-blocks").empty();
      for (var i = 3; i < 40; i += 8) {
        var newDiv = $("<div>");
        var newHeading = $("<h4>");
        var icon = $("<img>");
        var pTag = $("<p>");
        var pTagTwo = $("<p>");

        newDiv.attr("class", "card future-forecast");
        newHeading.text(response.list[i].dt_txt);
        icon.attr("src", "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png");
        pTag.text("Temperature: " + response.list[i].main.temp + " °F");
        pTagTwo.text("Humidity: " + response.list[i].main.humidity + "%");

        newDiv.append(newHeading, icon, pTag, pTagTwo);
        $("#forecast-blocks").append(newDiv);
      }
    });

    // creating a function within the dataPopulation function that holds the AJAX call for the UV Index.
    // the argument for this function (shown on line 57) will replace the coords parameter with the array latAndLon
    function uvIndex(coords) {
      var queryURLThree =
        "https://api.openweathermap.org/data/2.5/uvi?&lat=" +
        coords[0] +
        "&lon=" +
        coords[1] +
        "&appid=8a55540123da427eeafd1557098743c0";

      $.ajax({
        url: queryURLThree,
        method: "GET",
      }).then(function (response) {
        var uv = $("#uv-index");
        uv.text("UV Index: " + response.value);
        if (response.value > 1 && response.value < 3) {
          uv.attr("style", "background-color: limegreen");
        } else if (response.value > 3 && response.value < 8) {
          uv.attr("style", "background-color: yellow");
        } else if (response.value > 8) {
          uv.attr("style", "background-color: red");
        }
      });
    }
  }

  // creating a click event for previous searches saved to the id city-list
  $("#city-list").on("click", ".newBtn", function () {
    dataPopulation($(this).text());
  });
});

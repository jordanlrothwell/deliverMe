var search_history = document.querySelector("#search-history");
var searchbar = document.querySelector("input");
var dropdown_items = document.querySelectorAll(".dropdown-item");

// this function calls the search_location function to actually do the searching
// it also does serves to store searches in local memory
// additionally, it clears and focuses on the searchbar so that the user can re-run subsequent searches
function search() {
  const user_input = searchbar.value;
  storage.push(user_input);
  localStorage.setItem("storage", JSON.stringify(storage));
  update_dropdowns();
  searchbar.value = "searching the universe...";
  searchbar.focus();
  searchbar.select();
  search_location(user_input);
}

// this function is the meat and potatoes - it describes the website's search function
// the string the user inputs (presumeably a street address) will be parsed to the function
// it will search this street address using the TomTom API and produce a set of coordinates
// it then gets the coordinates for each hospital
// and calculates the distance between the street address and each hospital
// it finds the closest 9 hospitals, fetches the associated data and display it on cards
// if it fails, an error message is displayed in the text input box
function search_location(query) {
  let URL = "https://api.tomtom.com/search/2/geocode/" + query + ".json?storeResult=false&countrySet=AU&view=Unified&key=Nb6yeAUhcbqCYWfTg0Q980Ek8XViGDYz";
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      test_variable = data;
      // console.log("the closest address is " + data.results[0].address.streetName + " " + data.results[0].address.municipalitySubdivision + " " + data.results[0].id);
      var lat = test_variable.results[0].position.lat;
      var lon = test_variable.results[0].position.lon;
      // console.log("lat: " + lat + ", lon: " + lon);
      return ([lat, lon]);
    })
    .then(coords => {
      var lat = coords[0];
      var lon = coords[1];
      fetch("https://myhospitalsapi.aihw.gov.au/api/v1/reporting-units")
        .then(response => response.json())
        .then(data => {
          test_variable = data;
          var distances = [];
          for (let i = 0; i < data.result.length; i++) {
            // console.log("distance to " + data.result[i].reporting_unit_name + " is " + distance(lat, data.result[i].latitude, lon, data.result[i].longitude).toFixed(2) + "km");
            distances[i] = distance(lat, data.result[i].latitude, lon, data.result[i].longitude);
          }
          var sortedDistances = distances.slice(0);
          sortedDistances.sort(function (a, b) {
            return a - b;
          });
          closestHospitalCodes = [];
          closestHospitalNames = [];
          for (let i = 0; i < 9; i++) {
            for (let j = 0; j < data.result.length; j++) {
              if (sortedDistances[i] == distances[j]) {
                closestHospitalCodes.push(data.result[j].reporting_unit_code);
                closestHospitalNames.push(data.result[j].reporting_unit_name);
              }
            }
          }
          return ([closestHospitalCodes, closestHospitalNames]);
        })
        .then(codes => {
          document.querySelector("#search-results").innerHTML = "";
          for (let i = 0; i < codes[0].length; i++) {
            getData(codes[0][i], codes[1][i]);
          }
          searchbar.value = "";
          searchbar.focus();
        });
    })
    .catch((error) => {
      document.querySelector("#search-results").innerHTML = "";
      searchbar.value = "we got lost :(";
      searchbar.select();
    });;
}

// given a hospital code, this function will grab data from the AIWH API
//      (about hand hygiene, staph infection, specialised services
//       and presence of obstetric/neonatal/IVF units)
// and display this data on a card
function getData(hospitalCode, hospitalName) {
  let URL = "https://myhospitalsapi.aihw.gov.au/api/v1/reporting-units/" + hospitalCode + "/data-items";
  fetch(URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let resultsArray = data.result;

      let handHygieneData = resultsArray.filter((obj) => {
        return obj.measure_code === "MYH0019";
      });
      let staphInfectionData = resultsArray.filter((obj) => {
        return obj.measure_code === "MYH0023";
      });
      let specialisedServicesData = resultsArray.filter((obj) => {
        return obj.measure_code === "MYH0039";
      });
      let obstetricsUnit = specialisedServicesData.filter((obj) => {
        return obj.reported_measure_code === "MYH-RM0760";
      });
      let neoNatalUnit = specialisedServicesData.filter((obj) => {
        return obj.reported_measure_code === "MYH-RM0777";
      });
      let IVFUnit = specialisedServicesData.filter((obj) => {
        return obj.reported_measure_code === "MYH-RM0778";
      });

      if (handHygieneData && handHygieneData != 0) {
        var returnHygieneData = handHygieneData[handHygieneData.length - 1].value;
      } else {
        var returnHygieneData = "NA";
      }
      if (returnHygieneData == null) {
        returnHygieneData = "NA";
      }

      if (staphInfectionData && staphInfectionData != 0) {
        var returnStaphInfectionData = staphInfectionData[staphInfectionData.length - 1].value;
      } else {
        var returnStaphInfectionData = "NA";
      }
      if (returnStaphInfectionData == null) {
        returnStaphInfectionData = "NA";
      }

      if (specialisedServicesData && specialisedServicesData != 0) {
        var returnSpecialisedServicesData = specialisedServicesData[specialisedServicesData.length - 1].value;
      } else {
        var returnSpecialisedServicesData = "NA";
      }
      if (returnSpecialisedServicesData == null) {
        returnSpecialisedServicesData = "NA";
      }

      if (obstetricsUnit && obstetricsUnit != 0) {
        var returnObstetricsUnit = obstetricsUnit[obstetricsUnit.length - 1].value;
      } else {
        var returnObstetricsUnit = "NA";
      }
      if (returnObstetricsUnit == null) {
        returnObstetricsUnit = "NA";
      }

      if (neoNatalUnit && neoNatalUnit != 0) {
        var returnNeoNatalUnit = neoNatalUnit[neoNatalUnit.length - 1].value;
      } else {
        var returnNeoNatalUnit = "NA";
      }
      if (returnNeoNatalUnit == null) {
        returnNeoNatalUnit = "NA";
      }

      if (IVFUnit && IVFUnit != 0) {
        var returnIVFUnit = IVFUnit[IVFUnit.length - 1].value;
      } else {
        var returnIVFUnit = "NA";
      }
      if (returnIVFUnit == null) {
        returnIVFUnit = "NA";
      }

      // console.log([hospitalName, returnHygieneData, returnStaphInfectionData, returnSpecialisedServicesData, returnObstetricsUnit, returnNeoNatalUnit, returnIVFUnit]);

      document.querySelector("#search-results").innerHTML +=
        '<div class="card col-12 col-sm-6 col-md-4 bg-light">' +
        '<div class="card-body">' +
        '<h5 class="card-title">' + hospitalName + '</h5>' +
        '<p class="card-text"><strong>handHygieneData:</strong> ' + returnHygieneData + '</p>' +
        '<p class="card-text"><strong>staphInfectionData:</strong> ' + returnStaphInfectionData + '</p>' +
        '<p class="card-text"><strong>specialisedServicesData:</strong> ' + returnSpecialisedServicesData + '</p>' +
        '<p class="card-text"><strong>obstetricsUnit:</strong> ' + returnObstetricsUnit + '</p>' +
        '<p class="card-text"><strong>neoNatalUnit:</strong> ' + returnNeoNatalUnit + '</p>' +
        '<p class="card-text"><strong>IVFUnit:</strong> ' + returnIVFUnit + '</p>' +
        '</div>' +
        '</div>';

    });
}

// this function finds the distance between two longitude and latitude pairs in kilometers
// it is lifted directly from "https://www.geeksforgeeks.org/program-distance-two-points-earth/" without functional modification
function distance(lat1,
  lat2, lon1, lon2) {
  lon1 = lon1 * Math.PI / 180;
  lon2 = lon2 * Math.PI / 180;
  lat1 = lat1 * Math.PI / 180;
  lat2 = lat2 * Math.PI / 180;
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a = Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.pow(Math.sin(dlon / 2), 2);
  let c = 2 * Math.asin(Math.sqrt(a));
  let r = 6371;
  return (c * r);
}

// this function will inject HTML to create buttons to replicate previous searches
// it will also create the click listener events to ensure these dropdown items function
function update_dropdowns() {
  search_history.innerHTML = "";
  new_HTML = "";
  if (storage.length > 0) {

    // create dropdown menu items for previous searches
    for (let i = 0; i < storage.length; i++) {
      new_HTML += '<a class="dropdown-item" href="#">Search "' + storage[i] + '" again</a>';
    }
    new_HTML = '<div role="separator" class="dropdown-divider"></div>' + new_HTML;
    search_history.innerHTML = new_HTML;

    // create listener events for each previous search
    for (let i = 0; i < storage.length; i++) {
      var dropdown_items = document.querySelectorAll(".dropdown-item");
      dropdown_items[i + 1].addEventListener("click", function () {
        searchbar.value = storage[i];
        const user_input = searchbar.value;
        searchbar.value = "searching the universe...";
        searchbar.focus();
        searchbar.select();
        search_location(user_input);
      })
    }

  }
}

////////////////////////////////////////////

//  on startup, restore local storage items (i.e. previous search terms) into array
if (localStorage.getItem("storage") !== null) {
  var storage = JSON.parse(localStorage.getItem("storage"));
} else {
  var storage = [];
}

// then load the previous searches into the dropdown menu
update_dropdowns();

// focus on the searchbar so the user can start searching right away!
searchbar.focus();

// activates the search when the user selects the first dropdown item
dropdown_items[0].addEventListener("click", function () {
  search();
});

// alternatively, the user can hit enter instead of clicking the dropdown item
searchbar.addEventListener("keypress", function (event) {
  if (event.key === 'Enter') {
    dropdown_items[0].click();
  }
});

// clear history when the last dropdown item is selected
dropdown_items[dropdown_items.length - 1].addEventListener("click", function () {
  storage = [];
  localStorage.removeItem("storage");
  update_dropdowns();
  document.querySelector("#search-results").innerHTML = "";
  searchbar.value = "your secrets are safe ;)";
  searchbar.select();
  searchbar.focus();
});


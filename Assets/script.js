var searchbar = document.querySelector("input");
searchbar.focus();

var dropdown_items = document.querySelectorAll(".dropdown-item");
dropdown_items[0].addEventListener("click", search);

searchbar.addEventListener("keypress", function(event) {
  if (event.key === 'Enter') {
    dropdown_items[0].click();
  }
});



function search(){
  const user_input = searchbar.value;
  searchbar.value = "searching the universe...";
  console.log(user_input);
  searchbar.focus();
  searchbar.select();
  search_location(user_input);
}


function getData(hospitalCode, hospitalName) {
  let URL = "https://myhospitalsapi.aihw.gov.au/api/v1/reporting-units/" + hospitalCode + "/data-items";
  fetch(URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let resultsArray = data.result;
      // console.log(resultsArray);
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

      console.log([hospitalName, returnHygieneData, returnStaphInfectionData, returnSpecialisedServicesData, returnObstetricsUnit, returnNeoNatalUnit, returnIVFUnit]);
    
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
    
    searchbar.value = "";
    
    });
}

function distance(lat1,
  lat2, lon1, lon2)
{

// The math module contains a function
// named toRadians which converts from
// degrees to radians.
lon1 =  lon1 * Math.PI / 180;
lon2 = lon2 * Math.PI / 180;
lat1 = lat1 * Math.PI / 180;
lat2 = lat2 * Math.PI / 180;

// Haversine formula
let dlon = lon2 - lon1;
let dlat = lat2 - lat1;
let a = Math.pow(Math.sin(dlat / 2), 2)
+ Math.cos(lat1) * Math.cos(lat2)
* Math.pow(Math.sin(dlon / 2),2);

let c = 2 * Math.asin(Math.sqrt(a));

// Radius of earth in kilometers. Use 3956
// for miles
let r = 6371;

// calculate the result
return(c * r);
}




let measureCategoriesURL =
  "https://myhospitalsapi.aihw.gov.au/api/v1/measure-categories";

  var distances_x;
  var sortedDistances_x;


function search_location(query) {
  let URL = "https://api.tomtom.com/search/2/geocode/" + query + ".json?storeResult=false&countrySet=AU&view=Unified&key=Nb6yeAUhcbqCYWfTg0Q980Ek8XViGDYz";
  console.log(query);
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      test_variable = data;
      console.log(data);
      console.log("the closest address is " + data.results[0].address.streetName + " " + data.results[0].address.municipalitySubdivision + " " + data.results[0].id);
      var lat = test_variable.results[0].position.lat;
      var lon = test_variable.results[0].position.lon;
      console.log("lat: " + lat + ", lon: " + lon);
      return ([lat, lon]);
    })
    .then(coords => {
      var lat = coords[0];
      var lon = coords[1];
      fetch("https://myhospitalsapi.aihw.gov.au/api/v1/reporting-units")
        .then(response => response.json())
        .then(data => {
          console.log(data);
          test_variable = data;
          var distances = [];
          for (let i = 0; i < data.result.length; i++) {
            // console.log("distance to " + data.result[i].reporting_unit_name + " is " + distance(lat, data.result[i].latitude, lon, data.result[i].longitude).toFixed(2) + "km");
            distances[i] = distance(lat, data.result[i].latitude, lon, data.result[i].longitude);
          }
          distances_x = distances;
          var sortedDistances = distances.slice(0);
          sortedDistances.sort(function (a, b) { return a - b; });
          sortedDistances_x = sortedDistances;
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
          
        });
    });
}





// // this is logging all the measure categories into the console - we will use these categories to generate the URLs for our API queries
// // we can perform similar requests to retrive the names/codes/locations of all hospitals ('reporting units')
// let measureCategoriesURL =
//   "https://myhospitalsapi.aihw.gov.au/api/v1/measure-categories";

// let getMeasureCategories = function (URL) {
//   fetch(URL)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data.result);
//     });
// };

// getMeasureCategories(measureCategoriesURL);

// // this is an example of what the data actually looks like when we retrieve it
// // main parameters: measure category = MYH-HH ('Hand hygiene %'), reporting unit code = H0235 ('Colac Area Health')
// // other (required) parameters: skip = 0 (how many entries to skip), top = 100 (how many entries to return)
// let handWashingURL =
//   "https://myhospitalsapi.aihw.gov.au/api/v1/flat-data-extract/MYH-HH?skip=0&top=100&reporting_unit_code=H0235";

// let getExampleHH = function (URL) {
//   fetch(URL)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data.result);
//     });
// };

// getExampleHH(handWashingURL);


// let allHospitalsCoordinateData = [];

// let reportingUnitsURL =
//   "https://myhospitalsapi.aihw.gov.au/api/v1/reporting-units";

// let getHospitalsArray = function () {
//   fetch(reportingUnitsURL)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       let resultsArray = data.result;
//       let hospitalsOnly = resultsArray.filter((obj) => {
//         return obj.reporting_unit_type.reporting_unit_type_code === "H";
//       });
//       console.log(hospitalsOnly);
//       for (i = 0; i < hospitalsOnly.length; i++) {
//         let hospitalCoordinateData = {};
//         hospitalCoordinateData.latitude = (hospitalsOnly[i].latitude)
//         hospitalCoordinateData.longitude = (hospitalsOnly[i].longitude)
//         hospitalCoordinateData.hospital_code = (hospitalsOnly[i].reporting_unit_code)
//         allHospitalsCoordinateData.push(hospitalCoordinateData);
//       }
//       console.log(allHospitalsCoordinateData);
//     });
// };

// getHospitalsArray();

// let getData = function (hospitalCode) {
//   let URL = `https://myhospitalsapi.aihw.gov.au/api/v1/reporting-units/${hospitalCode}/data-items`;
//   fetch(URL)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       let resultsArray = data.result;
//       console.log(resultsArray);
//       let handHygieneData = resultsArray.filter((obj) => {
//         return obj.measure_code === "MYH0019";
//       });
//       let staphInfectionData = resultsArray.filter((obj) => {
//         return obj.measure_code === "MYH0023";
//       });
//       let specialisedServicesData = resultsArray.filter((obj) => {
//         return obj.measure_code === "MYH0039";
//       });
//       let obstetricsUnit = specialisedServicesData.filter((obj) => {
//         return obj.reported_measure_code === "MYH-RM0760";
//       });
//       let neoNatalUnit = specialisedServicesData.filter((obj) => {
//         return obj.reported_measure_code === "MYH-RM0777";
//       });
//       let IVFUnit = specialisedServicesData.filter((obj) => {
//         return obj.reported_measure_code === "MYH-RM0778";
//       });
//       console.log(handHygieneData);
//       console.log(staphInfectionData);
//       console.log(specialisedServicesData);
//       console.log(obstetricsUnit);
//       console.log(neoNatalUnit);
//       console.log(IVFUnit);
//     });
// };




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


var test_variable;
var test_location = "75 elizabeth street liverpool nsw";
var search_location = function(query) {
  let URL = "https://api.tomtom.com/search/2/geocode/" + query + ".json?storeResult=false&countrySet=AU&view=Unified&key=Nb6yeAUhcbqCYWfTg0Q980Ek8XViGDYz"
  console.log(query);
  fetch(URL)
  .then(response => response.json())
  .then(data => {
    test_variable = data;
    console.log(data);
    console.log("the closest address is " + data.results[0].address.streetName + " " + data.results[0].address.municipalitySubdivision + " " + data.results[0].id)
    var lat = test_variable.results[0].position.lat;
    var lon = test_variable.results[0].position.lon;
    console.log("lat: " + lat + ", lon: " + lon);
    return([lat,lon]);
  })
  .then(coords => {
    var lat = coords[0];
    var lon = coords[1];
    fetch("https://myhospitalsapi.aihw.gov.au/api/v1/reporting-units")
    .then(response => response.json())
    .then(data => {
      console.log(data);
      test_variable = data;

      for (let i = 0; i < data.result.length; i++) {
        console.log("distance to " + test_variable.result[i].reporting_unit_name + " is " + distance(lat, test_variable.result[i].latitude, lon, test_variable.result[i].longitude).toFixed(2) + "km");
      }
    })
  })
}

search_location(test_location);
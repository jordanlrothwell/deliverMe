
let getData = function (hospitalCode) {
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
        var returnHygieneData = handHygieneData[handHygieneData.length-1].value;
      } else {
        var returnHygieneData = "NA";
      }

      if (staphInfectionData && staphInfectionData !=0) {
        var returnStaphInfectionData = staphInfectionData[staphInfectionData.length-1].value;
      } else {
        var returnStaphInfectionData = "NA";
      }

      if (specialisedServicesData && specialisedServicesData != 0) {
        var returnSpecialisedServicesData = specialisedServicesData[specialisedServicesData.length-1].value;
      } else {
        var returnSpecialisedServicesData = "NA";
      }
      
      if (obstetricsUnit && obstetricsUnit != 0) {
        var returnObstetricsUnit = obstetricsUnit[obstetricsUnit.length-1].value;
      } else {
        var returnObstetricsUnit = "NA";
      }

      if (neoNatalUnit && neoNatalUnit != 0) {
        var returnNeoNatalUnit = neoNatalUnit[neoNatalUnit.length-1].value;
      } else {
        var returnNeoNatalUnit = "NA";        
      }


      if (IVFUnit && IVFUnit != 0) {
        var returnIVFUnit = IVFUnit[IVFUnit.length-1].value;
      } else {
          var returnIVFUnit = "NA";
      }



      console.log([resultsArray[0].reporting_unit_summary.reporting_unit_name, returnHygieneData, returnStaphInfectionData, returnSpecialisedServicesData, returnObstetricsUnit, returnNeoNatalUnit, returnIVFUnit]);
    });
};



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


var test_variable;
var temp;
var test_location = "32 Newenden Street Maddington";
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
      var distances = [];
      for (let i = 0; i < data.result.length; i++) {
        // console.log("distance to " + data.result[i].reporting_unit_name + " is " + distance(lat, data.result[i].latitude, lon, data.result[i].longitude).toFixed(2) + "km");
        distances[i] = distance(lat, data.result[i].latitude, lon, data.result[i].longitude);
      }
      distances_x = distances;
      var sortedDistances = distances.slice(0);
      sortedDistances.sort(function(a, b) { return a - b; });
      sortedDistances_x = sortedDistances;
      closestHospitalCodes = [];
      closestHospitalNames = [];
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < data.result.length; j++){
          if (sortedDistances[i] == distances[j]) {
            closestHospitalCodes.push(data.result[j].reporting_unit_code);
            closestHospitalNames.push(data.result[j].reporting_unit_name);
          }
        }
      }
      uniqueHospitalCodes = [...new Set(closestHospitalCodes)];
      console.log(uniqueHospitalCodes);
      return(uniqueHospitalCodes)
    })
    .then(codes => {

    })
  })
}

search_location(test_location);
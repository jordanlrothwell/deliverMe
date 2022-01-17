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


let allHospitalsCoordinateData = [];

let reportingUnitsURL =
  "https://myhospitalsapi.aihw.gov.au/api/v1/reporting-units";

let getHospitalsArray = function () {
  fetch(reportingUnitsURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let resultsArray = data.result;
      let hospitalsOnly = resultsArray.filter((obj) => {
        return obj.reporting_unit_type.reporting_unit_type_code === "H";
      });
      console.log(hospitalsOnly);
      for (i = 0; i < hospitalsOnly.length; i++) {
        let hospitalCoordinateData = {};
        hospitalCoordinateData.latitude = (hospitalsOnly[i].latitude)
        hospitalCoordinateData.longitude = (hospitalsOnly[i].longitude)
        hospitalCoordinateData.hospital_code = (hospitalsOnly[i].reporting_unit_code)
        allHospitalsCoordinateData.push(hospitalCoordinateData);
      }
      console.log(allHospitalsCoordinateData);
    });
};

getHospitalsArray();

let getData = function (hospitalCode) {
  let URL = `https://myhospitalsapi.aihw.gov.au/api/v1/reporting-units/${hospitalCode}/data-items`;
  fetch(URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let resultsArray = data.result;
      console.log(resultsArray);
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
      console.log(handHygieneData);
      console.log(staphInfectionData);
      console.log(specialisedServicesData);
      console.log(obstetricsUnit);
      console.log(neoNatalUnit);
      console.log(IVFUnit);
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

// Driver code   

let lat1 = 53.32055555555556;
let lat2 = 53.31861111111111;
let lon1 = -1.7297222222222221;
let lon2 = -1.6997222222222223;
document.write(distance(lat1, lat2,
        lon1, lon2) + " K.M");
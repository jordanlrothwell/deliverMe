// this is logging all the measure categories into the console - we will use these categories to generate the URLs for our API queries
// we can perform similar requests to retrive the names/codes/locations of all hospitals ('reporting units')
let measureCategoriesURL =
  "https://myhospitalsapi.aihw.gov.au/api/v1/measure-categories";

let getMeasureCategories = function (URL) {
  fetch(URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data.result);
    });
};

getMeasureCategories(measureCategoriesURL);

// this is an example of what the data actually looks like when we retrieve it
// main parameters: measure category = MYH-HH ('Hand hygiene %'), reporting unit code = H0235 ('Colac Area Health')
// other (required) parameters: skip = 0 (how many entries to skip), top = 100 (how many entries to return)
let handWashingURL =
  "https://myhospitalsapi.aihw.gov.au/api/v1/flat-data-extract/MYH-HH?skip=0&top=100&reporting_unit_code=H0235";

let getExampleHH = function (URL) {
  fetch(URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data.result);
    });
};

getExampleHH(handWashingURL);

let handWashingURL =
  "https://myhospitalsapi.aihw.gov.au/api/v1/flat-data-extract/MYH-HH?skip=0&top=100&reporting_unit_code=H0235";

let getExampleHH = function (URL) {
  fetch(URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data.result);
    });
};

getExampleHH(handWashingURL);
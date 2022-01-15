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
    });
};

let getLatestHHPercentage = function (arr) {
    console.log(arr.slice(-1)[0].value)
  }

let getHandWashingData = function (hospitalCode) {
  let URL = `https://myhospitalsapi.aihw.gov.au/api/v1/flat-data-extract/MYH-HH?skip=0&top=100&measure_code=MYH0019&reporting_unit_code=${hospitalCode}`;
  fetch(URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      getLatestHHPercentage(data.result.data);
    });
};
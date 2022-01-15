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

getData("H0021");

// {
//   "reported_measure_category_code": "SSI_ObstetricMaternityServices",
//   "reported_measure_category_name": "Obstetric services",
//   "reported_measure_category_type": {
//     "reported_measure_category_type_code": "SSI",
//     "reported_measure_category_type_name": "Specialised service unit"
//   }

//   {
//     "reported_measure_category_code": "SSI_NeonatalICULevelIII",
//     "reported_measure_category_name": "Neonatal intensive care unit",
//     "reported_measure_category_type": {
//       "reported_measure_category_type_code": "SSI",
//       "reported_measure_category_type_name": "Specialised service unit"
//     }
//     {
//       "reported_measure_category_code": "SSI_InVitroFertilisationUnit",
//       "reported_measure_category_name": "In-vitro fertilisation unit",
//       "reported_measure_category_type": {
//         "reported_measure_category_type_code": "SSI",
//         "reported_measure_category_type_name": "Specialised service unit"
//       }

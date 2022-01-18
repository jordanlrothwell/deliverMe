var userAddress = document.getElementById("input");

//event listener on user input (address autopopulated)
// userAddress.addEventListener("submit", function (event) {
//   event.preventDefault();

// fetch user addr

// TODO: I dont have the user coord func, hardcoding the lon lat for now

let lat = 53.32055555555556;
let lon = -1.7297222222222221;

getHospitalCoord();

getClosestHospitals(lat, lon)
    .then(function (hospitals) {
      console.log(hospitals);
    let closestHospitals = hospitals;
      
});



function getData(hospitalCode) {
    fetch(`https://myhospitalsapi.aihw.gov.au/api/v1/reporting-units/${hospitalCode}/data-items`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let resultsArray = data.result;
            console.log(resultsArray);
            let handHygieneData = resultsArray.filter((dataItem) => {
                return dataItem.measure_code === "MYH0019";
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


function getClosestHospitals(lat, lon) {

    return getHospitalCoord().then(function (hospitals) {
        // loop thru each hospital, apply distance function

        const hospitalWithDistance = hospitals.map(function (hospital) {
            hospital.distance = distance(lat, hospital.latitude, lon, hospital.longitude);
            return hospital;
        });

        hospitalWithDistance.sort(function (a, b) {
            return b.distance - a.distance; // sort in asc order
        });

        return hospitalWithDistance.slice(0, 3);
    })

}



function getHospitalCoord() {

    const allHospitalsCoordinateData = [];

    return fetch("https://myhospitalsapi.aihw.gov.au/api/v1/reporting-units?reporting_unit_type_code=H")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            let hospitalsOnly = data.result;

            for (i = 0; i < hospitalsOnly.length; i++) {
                let hospitalCoordinateData = {};
                hospitalCoordinateData.latitude = (hospitalsOnly[i].latitude)
                hospitalCoordinateData.longitude = (hospitalsOnly[i].longitude)
                hospitalCoordinateData.hospital_code = (hospitalsOnly[i].reporting_unit_code)
                allHospitalsCoordinateData.push(hospitalCoordinateData);
            }
            return allHospitalsCoordinateData;
        });

}

function distance(lat1, lat2, lon1, lon2) {

    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
        + Math.cos(lat1) * Math.cos(lat2)
        * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result
    return (c * r);
}

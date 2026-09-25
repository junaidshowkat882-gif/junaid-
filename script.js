// ================================
// MAP
// ================================

const map = L.map("map").setView(
    [25.69, 93.31],
    7
);


L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            "&copy; OpenStreetMap contributors"
    }
).addTo(map);


// ================================
// VARIABLES
// ================================

let selectedLatitude = null;
let selectedLongitude = null;
let marker = null;


// ================================
// HTML ELEMENTS
// ================================

const latitudeElement =
    document.getElementById("latitude");

const longitudeElement =
    document.getElementById("longitude");

const predictButton =
    document.getElementById("predictButton");


// ================================
// MAP CLICK
// ================================

map.on("click", function(event) {

    selectedLatitude =
        event.latlng.lat;

    selectedLongitude =
        event.latlng.lng;


    latitudeElement.textContent =
        selectedLatitude.toFixed(5);

    longitudeElement.textContent =
        selectedLongitude.toFixed(5);


    // Remove old marker
    if (marker !== null) {
        map.removeLayer(marker);
    }


    // Add new marker
    marker = L.marker([
        selectedLatitude,
        selectedLongitude
    ]).addTo(map);


    marker.bindPopup(`
        <b>Selected Location</b>
        <br>
        Latitude:
        ${selectedLatitude.toFixed(5)}
        <br>
        Longitude:
        ${selectedLongitude.toFixed(5)}
    `).openPopup();


    // Enable button
    predictButton.disabled = false;
});


// ================================
// BUTTON
// ================================

predictButton.addEventListener(
    "click",
    predictRisk
);


// ================================
// SEND DATA TO PYTHON
// ================================

async function predictRisk() {

    predictButton.textContent =
        "ML Predicting...";

    predictButton.disabled = true;


    try {

        const response = await fetch(
            "http://127.0.0.1:8000/predict",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    latitude:
                        selectedLatitude,

                    longitude:
                        selectedLongitude
                })
            }
        );


        if (!response.ok) {
            throw new Error(
                "API connection failed"
            );
        }


        // Get Python response
        const result =
            await response.json();


        console.log(
            "Python response:",
            result
        );


        // ============================
        // PUT DATA INTO HTML
        // ============================

        document.getElementById(
            "rainfall"
        ).textContent =
            result.rainfall + " mm";


        document.getElementById(
            "elevation"
        ).textContent =
            result.elevation + " m";


        document.getElementById(
            "slope"
        ).textContent =
            result.slope + "°";


        document.getElementById(
            "vegetation"
        ).textContent =
            result.vegetation;


        document.getElementById(
            "soil"
        ).textContent =
            result.soil;


        document.getElementById(
            "risk"
        ).textContent =
            result.risk;


        console.log(
            "ML confidence:",
            result.confidence + "%"
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "Cannot connect to Python API.\n" +
            "Make sure api.py is running."
        );
    }


    predictButton.textContent =
        "Predict Landslide Risk";

    predictButton.disabled = false;
}

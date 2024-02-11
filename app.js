// This line creates a Leaflet map with the id 'map' and sets the initial view to coordinates [0, 0] with a zoom level of 2.
var map = L.map('map').setView([0, 0], 2);

// This line creates an OpenStreetMap tile layer using Leaflet's tileLayer class.
//  It specifies the URL pattern for the tile images and includes attribution for OpenStreetMap contributors.
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
});

// This line creates a satellite imagery tile layer using Mapbox. It also includes attribution for Mapbox.

var satelliteLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg?access_token=YOUR_MAPBOX_ACCESS_TOKEN', {
    attribution: '© Mapbox'
});
// Adds the OpenStreetMap tile layer to the map.
osmLayer.addTo(map);

// Add Layer Control
// Creates an object baseLayers with two properties: "OpenStreetMap" and "Satellite Imagery", mapping to the respective tile layers.
var baseLayers = {
    "OpenStreetMap": osmLayer,
    "Satellite Imagery": satelliteLayer
};
// Creates an empty object overlayLayers and a FeatureGroup named drawnItems to hold user-drawn features.
//  The FeatureGroup is added to the map and assigned to the "User Drawn Features" property in overlayLayers.
var overlayLayers = {};
var drawnItems = new L.FeatureGroup().addTo(map);
overlayLayers["User Drawn Features"] = drawnItems;

//Adds a layer control to the map, allowing users to switch between the base map 
// layers (OpenStreetMap and Satellite Imagery) and the overlay layer (User Drawn Features).
L.control.layers(baseLayers, overlayLayers).addTo(map);

// Initialize Leaflet Draw
//Initializes Leaflet Draw control, enabling users to draw markers, polylines, polygons, 
// and rectangles. It also allows editing and removing features within the drawnItems FeatureGroup.
var drawControl = new L.Control.Draw({
    draw: {
        marker: true,
        polyline: true,
        polygon: true,
        circle: false,
        rectangle: true,
    },
    edit: {
        featureGroup: drawnItems,
        remove: true,
    },
});

//Adds the Leaflet Draw control to the map.
//Defines a function changeMapLayer to switch between base map layers based on the selected
//  value from an HTML element with id 'mapLayer'. It removes all existing layers from the map and adds the selected layer.
map.addControl(drawControl);

// Function to switch between map layers
function changeMapLayer() {
    var selectedLayer = document.getElementById('mapLayer').value;

    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });

    baseLayers[selectedLayer].addTo(map);
}

// Function to load spatial data
//Defines a function loadSpatialData to load spatial data from a file input element with id
//'fileInput'. It uses FileReader to read the contents of the selected file and calls addSpatialDataToMap with the parsed JSON data.
function loadSpatialData() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];

    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var spatialData = JSON.parse(e.target.result);
            addSpatialDataToMap(spatialData);
        };
        reader.readAsText(file);
    }
}

// Function to add spatial data to the map
// Defines a function addSpatialDataToMap to add GeoJSON spatial data to the map. It uses Leaflet's
//  geoJSON method and adds each layer to the drawnItems FeatureGroup.
function addSpatialDataToMap(spatialData) {
    L.geoJSON(spatialData, {
        onEachFeature: function (feature, layer) {
            drawnItems.addLayer(layer);
        }
    }).addTo(map);
}

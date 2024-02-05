var map = L.map('map').setView([0, 0], 2);

var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
});

var satelliteLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg?access_token=YOUR_MAPBOX_ACCESS_TOKEN', {
    attribution: '© Mapbox'
});

osmLayer.addTo(map);

// Add Layer Control
var baseLayers = {
    "OpenStreetMap": osmLayer,
    "Satellite Imagery": satelliteLayer
};

var overlayLayers = {};
var drawnItems = new L.FeatureGroup().addTo(map);
overlayLayers["User Drawn Features"] = drawnItems;

L.control.layers(baseLayers, overlayLayers).addTo(map);

// Initialize Leaflet Draw
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
function addSpatialDataToMap(spatialData) {
    L.geoJSON(spatialData, {
        onEachFeature: function (feature, layer) {
            drawnItems.addLayer(layer);
        }
    }).addTo(map);
}

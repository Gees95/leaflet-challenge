// URL of the USGS GeoJSON data for all earthquakes in the past 7 days
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the earthquake data and create the map
fetch(url)
    .then(response => response.json())
    .then(data => {
        createMap(data.features);
    })
    .catch(error => console.error('Error fetching the data:', error));

// Function to create the map
function createMap(earthquakeData) {
    // Initialize the map centered on the United States with a zoom level of 5
    const map = L.map('map').setView([37.7749, -122.4194], 5);

    // Add the base layer from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add earthquake data to the map
    addEarthquakesToMap(map, earthquakeData);

    // Add legend to the map
    addLegend(map);
}

// Function to add earthquake markers to the map
function addEarthquakesToMap(map, earthquakeData) {
    earthquakeData.forEach(quake => {
        const coords = quake.geometry.coordinates;
        const magnitude = quake.properties.mag;
        const depth = coords[2];

        // Define marker options based on magnitude and depth
        const markerOptions = {
            radius: magnitude * 4,
            fillColor: getColor(depth),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        // Add a circle marker to the map
        L.circleMarker([coords[1], coords[0]], markerOptions)
            .bindPopup(`<h3>${quake.properties.place}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth} km</p>`)
            .addTo(map);
    });
}

// Function to get the color based on the depth of the earthquake
function getColor(depth) {
    return depth > 90 ? '#DC143C' :
           depth > 70 ? '#F4A460' :
           depth > 50 ? '#FFA500' :
           depth > 30 ? '#FFD700' :
           depth > 10 ? '#FFFF00' :
                        '#7FFF00';
}

// Function to add a legend to the map
function addLegend(map) {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        const depths = [-10, 10, 30, 50, 70, 90];
        const colors = ['#7FFF00', '#FFFF00', '#FFD700', '#FFA500', '#F4A460', '#DC143C'];

        div.innerHTML += '<h4>Depth</h4>';
        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7;"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
        }

        return div;
    };

    legend.addTo(map);
}

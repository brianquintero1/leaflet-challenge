// Initialize the earthquake map
let myMap = L.map("map", {
    center: [37.8, -96],
    zoom: 5
  });
  
  // Add a tile layer to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(myMap);

  // Determine marker size based on earthquake magnitude
function markerSize(magnitude) {
    return magnitude * 4;
  }
  
  // Choose the color based on earthquake depth
  function depthColor(depth) {
    if (depth > 90) return '#ea2c2c';
    else if (depth > 70) return '#ea822c';
    else if (depth > 50) return '#ee9c00';
    else if (depth > 30) return '#eecc00';
    else if (depth > 10) return '#d4ee00';
    else return '#98ee00';
  }
  
  // Fetch the GeoJSON data and add to map
  var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  d3.json(queryUrl).then(function(data) {
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: depthColor(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + " km<br>Location: " + feature.properties.place);
      }
    }).addTo(myMap);
  });

  var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
      depths = [-10, 10, 30, 50, 70, 90],
      labels = [],
      from, to;

  for (var i = 0; i < depths.length; i++) {
    from = depths[i];
    to = depths[i + 1];

    labels.push(
      '<i style="background:' + depthColor(from + 1) + '"></i> ' +
      from + (to ? '&ndash;' + to : '+'));
  }

  div.innerHTML = labels.join('<br>');
  return div;
};

legend.addTo(myMap);
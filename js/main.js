const options = {
  zoomControl: false,
  zoomSnap: .1
}

const map = L.map('map', options);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

map.createPane("labels");
map.getPane("labels").style.zIndex = 549;
map.getPane("labels").style.pointerEvents = "none";
L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png", {
    pane: "labels"
  }
).addTo(map);

map.addControl(L.control.zoom({
  position: 'topright'
}));

// use D3 fetch to request data with async requests
const regionsData = d3.json('data/regions.json');
const colorsData = d3.json('data/boldcolors.json');
const speciesData = d3.json('data/water-buttercup.json');

// use Promise to wait until data is all loaded
Promise.all([regionsData, colorsData, speciesData]).then(drawMap);

function drawMap(data) {
  // function is called when Promise is fulfilled and data is ready

  // pull out separate data arrays and assign to variables
  const regions = data[0];
  const colors = data[1];
  const species = data[2];

  // store a reference to the HTML list
  const legendList = $('#legend-list');

  // create a layerGroup with the geojson data
  var regionsLayerGroup = L.geoJson(regions, {
    style: function (feature) {
      // use the colors object to style each polygon a unique color
      return {
        color: colors.Bold[16][feature.properties.REGC2015_C - 1],
        fillColor: colors.Bold[16][feature.properties.REGC2015_C - 1],
        fillOpacity: .3,
        weight: 0.5
      }
    },
    onEachFeature(feature, layer) {
      //console.log(feature.properties.REGC2015_1);
      //when mousing over a polygon layer
      layer.on('mouseover', function () {
        // provide a visual affordance
        this.setStyle({
          color: colors.Bold[16][feature.properties.REGC2015_C - 1],
          fillOpacity: .5,
          weight: 2
        }).bringToFront();
        // select the corresponding list item
        // and add the highlight class to make bold
        $('#region-' + feature.properties.REGC2015_C).addClass('highlight');
        // when mousing out
        layer.on('mouseout', function () {
          // reset back to our base styling opacity
          this.setStyle({
            color: colors.Bold[16][feature.properties.REGC2015_C - 1],
            fillOpacity: .3,
            weight: 0.5
          });
          // remove the class highlight from the legend list item
          $('#region-' + feature.properties.REGC2015_C).removeClass('highlight');
        });
        // zoom to layer on polygon click
        layer.on('click', function () {
          map.flyToBounds(this.getBounds());
        });
      })
    }
  }).addTo(map);

  // fit map bounds to feature extent
  map.fitBounds(regionsLayerGroup.getBounds(), {
    padding: [18, 18]
  })

  // to alphabetize legend list, create empty container for legend region names
  const legendRegions = [];
  for (var names in regions.features) {
    const props = regions.features[names].properties;
    legendRegions.push(props);

  };

  // sort
  legendRegions.sort(function (a, b) {
    return a.REGC2015_C - b.REGC2015_C
  });

  // list item for each feature in the legend
  for (let i = 1; i <= regions.features.length; i++) {
    const legendNames = [legendRegions[i - 1].REGC2015_1];
    legendList.append('<li class="legend-item" id="region-' + i + '"><a style="color:' + colors.Bold[16][i - 1] +
      '" href="#"> ' + legendNames + '</a></li>');
  };

  // toggle regions layer on zoom level 
  map.on('zoomend', onZoomend);

  function onZoomend() {
    if (map.getZoom() >= 10) {
      map.removeLayer(regionsLayerGroup);
      $('.legend-item').removeClass('highlight');
    };
    if (map.getZoom() < 10) {
      map.addLayer(regionsLayerGroup);
    };
  };

  // select all the list items and on mouseover
  $('.legend-item').on('mouseover', function () {
    // extract the specific number from the specific item
    // being moused over
    let num = this.id.replace('region-', '');
    // convert num to integer
    num = parseInt(num);
    // send this number as an argument to the highlightRegion function
    highlightRegion(num);
  });

  function highlightRegion(regionNum) {
    // loop through the regions polygons
    regionsLayerGroup.eachLayer(function (layer) {
      // if the region id matches the one we're mousing over
      if (layer.feature.properties.REGC2015_C === regionNum) {
        // change the layer style
        layer.setStyle({
          fillOpacity: .5,
          weight: 2
        }).bringToFront();
      };
      // deselects layer highlight on legend mouseout
      $('.legend-item').on('mouseout', function () {
        layer.setStyle({
          fillOpacity: .3,
          weight: 0.5
        });
      });
    });
  };

  // zoom to polyon on legend click
  $('.legend-item').on('click', function () {
    // extract the specific number from the specific item
    let num = this.id.replace('region-', '');
    // convert num to integer
    num = parseInt(num);
    zoomToRegion(num);
  });

  function zoomToRegion(regionNum) {
    // loop through the regions polygons
    regionsLayerGroup.eachLayer(function (layer) {
      // if the region id matches the one we're clicking on
      if (layer.feature.properties.REGC2015_C === regionNum) {
        map.flyToBounds(layer.getBounds());
      };
    });
  };

  // create new markerClusterGroup
  var markers = L.markerClusterGroup();
  // loop through all our signals features
  species.features.forEach(function (feature) {
    // create a new Leaflet marker for each
    var coords = feature.geometry.coordinates,
      marker = L.marker([coords[1], coords[0]]);
    // bind a tooltip to the marker
    marker.bindTooltip(marker.getLatLng().lat.toFixed(6) + ", " + marker.getLatLng().lng.toFixed(6));
    // add the marker to the markerClusterGroup
    markers.addLayer(marker);
  });
  // add the markerClusterGroup to the map
  map.addLayer(markers);
};
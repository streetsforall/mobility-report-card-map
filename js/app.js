mapboxgl.accessToken = 'pk.eyJ1Ijoic2NvdHRncnViZXIiLCJhIjoiY2xkamVlOHBuMWt6czNwbndweDJiOGhxcSJ9.ZdEl7MRrTI87Q-PzKoTVGQ';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: [-121.493611, 38.576667], // starting position [lng, lat] State Capitol
  zoom: 6, // starting zoom
});
let hoveredStateId = null;

map.on('load', () => {
  map.addSource('counties', {
    type: 'geojson',
    data: 'data/California_County_Boundaries.geojson',
    generateId: true // This ensures that all features have unique IDs
  });

  map.addLayer({
    id: 'county-fills',
    type: 'fill',
    source: 'counties',
    'layout': {},
    paint: {
      'fill-color': '#e75ba0',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        1,
        0.5
      ]
    }
  });

  map.addLayer({
    id: 'county-lines',
    type: 'line',
    source: 'counties',
    'layout': {},
    paint: {
      'line-color': '#173362',
      'line-width': 0.5
    }
  });

  // When the user moves their mouse over the state-fill layer, we'll update the
  // feature state for the feature under the mouse.
  map.on('mousemove', 'county-fills', (e) => {
    if (e.features.length > 0) {
      if (hoveredStateId !== null) {
        map.setFeatureState(
          { source: 'counties', id: hoveredStateId },
          { hover: false }
        );
      }
      hoveredStateId = e.features[0].id;
      map.setFeatureState(
        { source: 'counties', id: hoveredStateId },
        { hover: true }
      );
    }
  });

  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
  map.on('mouseleave', 'county-fills', () => {
    if (hoveredStateId !== null) {
      map.setFeatureState(
        { source: 'counties', id: hoveredStateId },
        { hover: false }
      );
    }
    hoveredStateId = null;
  });

  const countyNameDisplay = document.getElementById('county-name');
  const countyCodeDisplay = document.getElementById('county-code');
  const countyAbbrDisplay = document.getElementById('county-abbr');

  let countyID = null;

  map.on('mousemove', 'county-fills', (event) => {
    map.getCanvas().style.cursor = 'pointer';
    // Set constants equal to the current feature's magnitude, location, and time
    const countyName = event.features[0].properties.COUNTY_NAME;
    const countyCode = event.features[0].properties.COUNTY_CODE;
    const countyAbbr = event.features[0].properties.COUNTY_ABBREV;

    // Check whether features exist
    if (event.features.length === 0) return;
    // Display the magnitude, location, and time in the sidebar
    countyNameDisplay.textContent = countyName;
    countyCodeDisplay.textContent = countyCode;
    countyAbbrDisplay.textContent = countyAbbr;

    // If quakeID for the hovered feature is not null,
    // use removeFeatureState to reset to the default behavior
    if (countyID) {
      map.removeFeatureState({
        source: 'counties',
        id: countyID
      });
    }

    countyID = event.features[0].id;

    // When the mouse moves over the earthquakes-viz layer, update the
    // feature state for the feature under the mouse
    map.setFeatureState(
      {
        source: 'counties',
        id: countyID
      },
      {
        hover: true
      }
    );
  });
});


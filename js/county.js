map.on('load', () => {
  map.addSource(
    'counties', {
    type: 'geojson',
    data: 'data/California_County_Boundaries.geojson',
    generateId: true // This ensures that all features have unique IDs
  });

  map.addLayer({
    id: 'County',
    type: 'fill',
    source: 'counties',
    'layout': {},
    paint: {
      'fill-color': '#e75ba0',
      'fill-outline-color': '#033662',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.8,
        0.4
      ]
    }
  });

  // map.addLayer({
  //   id: 'county-lines',
  //   type: 'line',
  //   source: 'counties',
  //   'layout': {},
  //   paint: {
  //     'line-color': '#e75ba0',
  //     'line-width': 0.5
  //   }
  // });

});

// hover effect for counties
// When the user moves their mouse over the state-fill layer, we'll update the
// feature state for the feature under the mouse.
map.on('mousemove', 'County', (e) => {
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
map.on('mouseleave', 'County', () => {
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

map.on('mousemove', 'County', (event) => {
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

  // If countyID for the hovered feature is not null,
  // use removeFeatureState to reset to the default behavior
  if (countyID) {
    map.removeFeatureState({
      source: 'counties',
      id: countyID
    });
  }

  countyID = event.features[0].id;

  // When the mouse moves over the county layer, update the
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
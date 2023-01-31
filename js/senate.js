map.on('load', () => {
  map.addSource('senate-districts', {
    type: 'geojson',
    data: 'data/Senate_Legislative_Districts_in_California.geojson',
    generateId: true // This ensures that all features have unique IDs
  });

  map.addLayer({
    id: 'Senate',
    type: 'fill',
    source: 'senate-districts',
    'layout': {},
    paint: {
      'fill-color': '#ffb531',
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
  //   id: 'senate-lines',
  //   type: 'line',
  //   source: 'senate-districts',
  //   'layout': {},
  //   paint: {
  //     'line-color': '#ffb531',
  //     'line-width': 0.5
  //   }
  // });
});

// hover effect for senate
// When the user moves their mouse over the state-fill layer, we'll update the
// feature state for the feature under the mouse.
map.on('mousemove', 'Senate', (e) => {
  if (e.features.length > 0) {
    if (hoveredStateId !== null) {
      map.setFeatureState(
        { source: 'senate-districts', id: hoveredStateId },
        { hover: false }
      );
    }
    hoveredStateId = e.features[0].id;
    map.setFeatureState(
      { source: 'senate-districts', id: hoveredStateId },
      { hover: true }
    );
  }
});

// When the mouse leaves the state-fill layer, update the feature state of the
// previously hovered feature.
map.on('mouseleave', 'Senate', () => {
  if (hoveredStateId !== null) {
    map.setFeatureState(
      { source: 'senate-districts', id: hoveredStateId },
      { hover: false }
    );
  }
  hoveredStateId = null;
});

const SenateDistrictNameDisplay = document.getElementById('senate-district-name');
const SenateDistrictLabelDisplay = document.getElementById('senate-district-label');
const SenateAreaSqMiDisplay = document.getElementById('senate-area-sq-mi');

let senateID = null;

map.on('mousemove', 'Senate', (event) => {
  map.getCanvas().style.cursor = 'pointer';
  // Set constants equal to the current feature's senate districtname, label and area
  const Senate_District_Name = event.features[0].properties.SenateDistrictName;
  const Senate_District_Label = event.features[0].properties.SenateDistrictLabel;
  const Senate_Area_SqMi = event.features[0].properties.SenateAreaSqMi;

  // Check whether features exist
  if (event.features.length === 0) return;
  // Display the magnitude, location, and time in the sidebar
  SenateDistrictNameDisplay.textContent = Senate_District_Name;
  SenateDistrictLabelDisplay.textContent = Senate_District_Label;
  SenateAreaSqMiDisplay.textContent = Senate_Area_SqMi;

  // If quakeID for the hovered feature is not null,
  // use removeFeatureState to reset to the default behavior
  if (senateID) {
    map.removeFeatureState({
      source: 'senate-districts',
      id: senateID
    });
  }

  senateID = event.features[0].id;

  // When the mouse moves over the earthquakes-viz layer, update the
  // feature state for the feature under the mouse
  map.setFeatureState(
    {
      source: 'senate-districts',
      id: senateID
    },
    {
      hover: true
    }
  );
});
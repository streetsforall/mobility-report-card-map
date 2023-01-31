map.on('load', () => {

  map.addSource('assembly-districts', {
    type: 'geojson',
    data: 'data/Assembly_Legislative_Districts_in_California.geojson',
    generateId: true // This ensures that all features have unique IDs
  });

  map.addLayer({
    id: 'Assembly',
    type: 'fill',
    source: 'assembly-districts',
    'layout': {},
    paint: {
      'fill-color': '#9c56b8',
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
  //   id: 'assembly-lines',
  //   type: 'line',
  //   source: 'assembly-districts',
  //   'layout': {},
  //   paint: {
  //     'line-color': '#9c56b8',
  //     'line-width': 0.5
  //   }
  // });

});



// hover effect for senate
// When the user moves their mouse over the state-fill layer, we'll update the
// feature state for the feature under the mouse.
map.on('mousemove', 'Assembly', (e) => {
  if (e.features.length > 0) {
    if (hoveredStateId !== null) {
      map.setFeatureState(
        { source: 'assembly-districts', id: hoveredStateId },
        { hover: false }
      );
    }
    hoveredStateId = e.features[0].id;
    map.setFeatureState(
      { source: 'assembly-districts', id: hoveredStateId },
      { hover: true }
    );
  }
});

// When the mouse leaves the state-fill layer, update the feature state of the
// previously hovered feature.
map.on('mouseleave', 'Assembly', () => {
  if (hoveredStateId !== null) {
    map.setFeatureState(
      { source: 'assembly-districts', id: hoveredStateId },
      { hover: false }
    );
  }
  hoveredStateId = null;
});

const AssemblyDistrictNameDisplay = document.getElementById('assembly-district-name');
const AssemblyDistrictLabelDisplay = document.getElementById('assembly-district-label');
const AssemblyAreaSqMiDisplay = document.getElementById('assembly-area-sq-mi');

let assemblyID = null;

map.on('mousemove', 'Assembly', (event) => {
  map.getCanvas().style.cursor = 'pointer';
  // Set constants equal to the current feature's assembly districtname, label and area
  const Assembly_District_Name = event.features[0].properties.AssemblyDistrictName;
  const Assembly_District_Label = event.features[0].properties.AssemblyDistrictLabel;
  const Assembly_Area_SqMi = event.features[0].properties.AssemblyAreaSqMi;

  // Check whether features exist
  if (event.features.length === 0) return;
  // Display the magnitude, location, and time in the sidebar
  AssemblyDistrictNameDisplay.textContent = Assembly_District_Name;
  AssemblyDistrictLabelDisplay.textContent = Assembly_District_Label;
  AssemblyAreaSqMiDisplay.textContent = Assembly_Area_SqMi;

  // If assemblyID for the hovered feature is not null,
  // use removeFeatureState to reset to the default behavior
  if (assemblyID) {
    map.removeFeatureState({
      source: 'assembly',
      id: assemblyID
    });
  }

  assemblyID = event.features[0].id;

  // When the mouse moves over the assembly layer, update the
  // feature state for the feature under the mouse
  map.setFeatureState(
    {
      source: 'assembly-districts',
      id: assemblyID
    },
    {
      hover: true
    }
  );
});
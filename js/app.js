mapboxgl.accessToken = 'pk.eyJ1Ijoic2NvdHRncnViZXIiLCJhIjoiY2xkamVlOHBuMWt6czNwbndweDJiOGhxcSJ9.ZdEl7MRrTI87Q-PzKoTVGQ';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: [-121.493611, 38.576667], // starting position [lng, lat] State Capitol
  zoom: 6, // starting zoom
});

let hoveredStateId = null;

var toggleableLayerIds = [ 'County', 'Senate', 'Assembly' ];

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
}



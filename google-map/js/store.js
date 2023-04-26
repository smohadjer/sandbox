import { MarkerClusterer } from "https://cdn.skypack.dev/@googlemaps/markerclusterer@2.0.3";

const LOCATIONS_COUNT = 1000;
const DISTANCE_IN_METER = 50000;
const markers = [];
const visibleMarkers = [];
const getDistanceInKM = (distance) => {
    // returns distance in km with two decimals
    return Math.round(distance/10)/100;
};
const showStoresList = (stores) => {
    const panel = document.getElementById('panel');
    let markup = '';
    panel.removeAttribute('hidden');
    console.log('sdfsd');

    if (stores.length == 0) {
      console.log('empty stores');
      markup = `<h3>No location found!</h3>`;
      panel.innerHTML = markup;
      return;
    }

    // sort stores based on their distance
    stores.sort((a, b) => a.getProperty('distance') > b.getProperty('distance') ? 1 : -1);

    markup = `<h3>Found ${stores.length} Locations within ${getDistanceInKM(DISTANCE_IN_METER)} KM</h3>`;
    stores.forEach((store) => {
      const storeName = store.getProperty('name');
      markup += `<p>${storeName} (${store.getProperty('distance')}km)</p>`;
    });
    panel.innerHTML = markup;
};
const getGeoJson = async (url) => {
    const geojson = {
        'type': 'FeatureCollection',
        'features': []
    };
    const response = await fetch(url);
    const jsonData = await response.json();
    const sampleData = jsonData.slice(0, LOCATIONS_COUNT).map(item => {
        const feature = {
            type: "Feature",
            geometry: {
                "type": "Point",
                "coordinates": [item.longitude, item.latitude]
            },
            id: item.store_id,
            properties: {
                city: item.city,
                name: item.name,
                country: item.country,
                storeid: item.store_id
            }
        }
        return feature;
    });

    sampleData.forEach((item) => {
        geojson.features.push(item);
    });

    return geojson;
};
const autocompleteListener = async (map, mc, place) => {
    if (!place.geometry) {
        window.alert('No address available for input: \'' + place.name + '\'');
        return;
    }

    const country = () => {
        for (const component of place.address_components) {
            const componentType = component.types[0];
            if (componentType == 'country') {
                return component.short_name;
            }
        }
    };

    console.log(country());

    updateMap(map, mc, place);
};
const updateMap = async (map, mc, place) => {
    map.setCenter(place.geometry.location);
    map.setZoom(9);

    const rankedStores = await findStores(map);

    // update markers on the map
    mc.clearMarkers();
    visibleMarkers.length = 0;

    rankedStores.forEach((store) => {
        const tmp_id = store.getProperty('storeid');
        markers.forEach((marker) => {
            if (marker.get('id') === tmp_id) {
                visibleMarkers.push(marker);
            }
        });
    });

    mc.addMarkers(visibleMarkers);
    showStoresList(rankedStores);
};

const findStores = async (map) => {
    const {spherical} = await google.maps.importLibrary("geometry");
    const rankedStores = [];

    map.data.forEach((store) => {
        const storeCountry = store.getProperty('country');
        const storeId = store.getProperty('storeid');
        const storeLocation = store.getGeometry().get();
        const originLocation = map.getCenter();

        //console.log(storeCountry, storeId, storeLocation);
        const distance = google.maps.geometry.spherical.computeDistanceBetween(originLocation, storeLocation);
        //console.log(distance);
        if (distance < DISTANCE_IN_METER) {
            store.setProperty('distance', getDistanceInKM(distance));
            rankedStores.push(store);
        }
    });
    return rankedStores;
};
const addAutocomplete = (map, mc, input) => {
    const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['(regions)'],
        fields: ['address_components', 'geometry', 'name']
    });
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        autocompleteListener(map, mc, place);
    });
};

async function initMap() {
    const bounds = new google.maps.LatLngBounds();
    const infoWindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true,
    });
    const map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 52.632469, lng: -1.689423},
        zoom: 2
    });
    const dataIsGeoJSON = false;
    let allFeatures;

    // stackoverflow: https://stackoverflow.com/questions/25267146/google-maps-javascript-api-v3-data-layer-markerclusterer
    map.data.addListener('addfeature', function(e) {
        const geo = e.feature.getGeometry();
        const coordinates = geo.get();
        const title = e.feature.getProperty('name');
        if (geo.getType() === 'Point') {
            const marker = new google.maps.Marker({
                position: coordinates,
                title: title,
                map: map
            });

            marker.set('id', e.feature.getProperty('storeid'));

            marker.addListener("click", (event) => {
                const oldCenter = map.getCenter();
                console.log(event);
                console.log(marker.title);
                infoWindow.setContent(title);
                infoWindow.open(map, marker);
            });

            markers.push(marker);
            bounds.extend(coordinates);
            //map.data.remove(e.feature);
        }
    });


    if (dataIsGeoJSON) {
        map.data.loadGeoJson('data/stores.json', {idPropertyName: 'storeid'});
    } else {
        const data = await getGeoJson('data/locations.json')
        allFeatures = map.data.addGeoJson(data, {idPropertyName: 'storeid'});
    }

    // we won't use data layer to show locations on the map since clustring markers is easier than clustering point features on a data layer
    map.data.setMap(null);

    const cluster = new MarkerClusterer({ markers, map });
    map.fitBounds(bounds);

    const input = document.getElementById('pac-input');
    addAutocomplete(map, cluster, input);
}

window.initMap = initMap;

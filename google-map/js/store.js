const LOCATIONS_COUNT = 5000;
const DISTANCE_IN_METER = 50000;

const showStoresList = (stores) => {
    const panel = document.getElementById('panel');

    if (stores.length == 0) {
      console.log('empty stores');
      panel.innerHTML = '';
      return;
    }

    let markup = `<h3>${stores.length} Found!</h3>`;
    stores.forEach((store) => {
      console.log(store);
      const storeName = store.getProperty('name');
      markup += `<p class="place">${storeName}</p>
      <p class="distanceText">${store.getProperty('distance')}km</p>`;
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

async function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 52.632469, lng: -1.689423},
        zoom: 2
    });
    const dataIsGeoJSON = false;

    if (dataIsGeoJSON) {
        map.data.loadGeoJson('data/stores.json', {idPropertyName: 'storeid'});
    } else {
        const data = await getGeoJson('data/locations.json')
        map.data.addGeoJson(data, {idPropertyName: 'storeid'});
    }

    enhanceMap(map);
}

function enhanceMap(map) {
    const infoWindow = new google.maps.InfoWindow();

    // Show the information for a store when its marker is clicked.
    map.data.addListener('click', (event) => {
      const category = event.feature.getProperty('category');
      const name = event.feature.getProperty('name');
      const description = event.feature.getProperty('description');
      const hours = event.feature.getProperty('hours');
      const phone = event.feature.getProperty('phone');
      const position = event.feature.getGeometry().get();
      const content = `
        <p>id: ${event.feature.getProperty('storeid')}</p>
        <h2>${name}</h2><p>${description}</p>
        <p><b>Open:</b> ${hours}<br/><b>Phone:</b> ${phone}</p>
      `;

      infoWindow.setContent(content);
      infoWindow.setPosition(position);
      infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
      infoWindow.open(map);
    });

    // Build and add the search bar
    const card = document.createElement('div');
    const titleBar = document.createElement('div');
    const title = document.createElement('div');
    const container = document.createElement('div');
    const input = document.createElement('input');

    card.setAttribute('id', 'pac-card');
    title.setAttribute('id', 'title');
    title.textContent = 'Find the nearest store';
    titleBar.appendChild(title);
    container.setAttribute('id', 'pac-container');
    input.setAttribute('id', 'pac-input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Enter an address');
    container.appendChild(input);
    card.appendChild(titleBar);
    card.appendChild(container);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['(regions)'],
        fields: ['address_components', 'geometry', 'name']
    });

    // Set the origin point when the user selects an address
    const originMarker = new google.maps.Marker({map: map});
    originMarker.setVisible(false);
    let originLocation = map.getCenter();

    autocomplete.addListener('place_changed', async () => {
        const getCountryCode = (place) => {
            for (const component of place.address_components) {
                const componentType = component.types[0];
                if (componentType == 'country') {
                    return component.short_name;
                }
            }
        };
        const place = autocomplete.getPlace();
        const country = getCountryCode(place);

        // use country to reduce data for better performance

        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert('No address available for input: \'' + place.name + '\'');
            return;
        }

        // Recenter the map to the selected address
        originLocation = place.geometry.location;
        map.setCenter(originLocation);
        map.setZoom(9);

        const {spherical} = await google.maps.importLibrary("geometry");
        const rankedStores = [];

        map.data.forEach((store) => {
            const storeCountry = store.getProperty('country');
            const storeId = store.getProperty('storeid');
            const storeLocation = store.getGeometry().get();

            console.log(storeCountry, storeId, storeLocation);
            const distance = google.maps.geometry.spherical.computeDistanceBetween(originLocation, storeLocation);
            console.log(distance);
            if (distance < DISTANCE_IN_METER) {
                store.setProperty('distance', Math.round(distance/10)/100);
                rankedStores.push(store);
            }
        });

        showStoresList(rankedStores);
    });
}

window.initMap = initMap;

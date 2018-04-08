
import locService from './services/loc.service.js';
import mapService from './services/map.service.js';
import renderService from './services/render.service.js';


// Globals
var gCoords = {};
var gMarkerExists = false;

// Constants
const LOCATION_KEY = 'AIzaSyD691kT7ZRaeQx1jU9EVr9UdxIYGg2EFkE';
const WEATHER_KEY = '958040db844c340794310f2c5b7a050a';


// Event Listeners
document.querySelector('.my-location-btn').addEventListener('click', (ev) => {
    setCurrPos();
})
document.querySelector('form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    convertToCoords();
})
document.querySelector('.copy-location-btn').addEventListener('click', (ev) => {
    createStrUrl();
})
document.querySelector("#copy").addEventListener("click", copyUrl);


window.onload = () => {
    mapService.initMap()
        .then(
            () => {
                let lat = getParameterByName('lat');
                let lng = getParameterByName('lng');
                if (lat && lng) {
                    setPositionByCoords(+lat, +lng);
                } else {
                    setCurrPos();
                }
            }
        );
}

function convertToCoords() {
    let address = document.querySelector('.searched-address').value;
    let addressToCopy = document.querySelector('.address').innerText;

    if (address) {
        renderService.renderAddress(address);
        return geocoding(address).then(function (coords) {
            return coords;
        });
    } else {
        return geocoding(addressToCopy).then(function (coords) {
            return coords;
        });
    }

}

function setMarker(lat, lng, address) {
    if (gMarkerExists) mapService.removeMarker();
    mapService.addMarker({ lat, lng }, address);
    mapService.setCenter({ lat, lng });
    gCoords.lat = lat;
    gCoords.lng = lng;
    gMarkerExists = true;
}

function setCurrPos() {
    locService.getPosition()
        .then(pos => {
            // console.log('User position is:', pos.coords);
            reverseGeocoding(pos.coords.latitude, pos.coords.longitude)
                .then(function (address) {
                    setMarker(pos.coords.latitude, pos.coords.longitude, address);
                    renderService.renderAddress(address);
                    getWeather(pos.coords.latitude, pos.coords.longitude);
                })
                .catch(err => {
                    console.log('err!!!', err);
                })
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function setPositionByCoords(lat, lng) {
    reverseGeocoding(lat, lng)
        .then(function (address) {
            setMarker(lat, lng, address);
            renderService.renderAddress(address);
            getWeather(lat, lng);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}


// Url
function createStrUrl() {
    var strUrl = window.location.href;
    strUrl += '?lat=' + gCoords.lat + '&lng=' + gCoords.lng;
    return strUrl;
}

function copyUrl() {
    var strUrl = createStrUrl();
    var elUrlInput = document.querySelector(".copy-input");
    elUrlInput.value = strUrl;
    elUrlInput.select();
    document.execCommand("copy");
}


// Ajax Calls
function geocoding(address) {
    let key = LOCATION_KEY;

    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`)
        .then(function (res) {
            console.log('data', res.data);
            let lat = res.data.results[0].geometry.location.lat;
            let lng = res.data.results[0].geometry.location.lng;

            setMarker(lat, lng, address);
            getWeather(lat, lng);
            return { lat, lng };
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function reverseGeocoding(lat, lng) {
    let key = LOCATION_KEY;

    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`)
        .then(function (res) {
            // console.log('data', res.data);
            var address = res.data.results[0].formatted_address;
            return address;
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function getWeather(lat, lon) {
    let key = WEATHER_KEY;

    return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`)
        .then(function (res) {
            renderService.renderWeather(res);
            return res;
        })
        .catch(err => {
            console.log('err', err);
        })
}







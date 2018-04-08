import { GoogleMapsApi } from './gmap.class.js';

var map;
var gMarker;

function initMap(lat = 32.0749831, lng = 34.9120554) {

    console.log('InitMap');

    const gmapApi = new GoogleMapsApi();
    return gmapApi.load().then(() => {
        map = new google.maps.Map(
            document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })

        console.log('zoom', map.zoom);
            
        console.log('Map!', map);
    });
}

function setCenter(loc){
    map.setCenter(new google.maps.LatLng(loc));
}


function addMarker(loc, address) {
    gMarker = new google.maps.Marker({
        position: loc,
        map: map,
        title: address
    });
}

function removeMarker(){
    gMarker.setMap(null);
}



export default {
    initMap,
    addMarker,
    setCenter,
    removeMarker
}


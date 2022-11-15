const KEY = 'at_9kdXForG94a470xDjZ4TFPlPdENRx';
const form = document.querySelector('.search-app-form');
const isAddress = new RegExp(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
const isDomain = new RegExp(/\b((xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}\b$/m);
const ipView = document.querySelector('[data-ip]');
const locationView = document.querySelector('[data-location]');
const timezoneView = document.querySelector('[data-timezone]');
const ispView = document.querySelector('[data-isp]'); 
let latitud = 53;
let longitud = 0;
let zoom = 16;
let type = ['ipAddress','domain'];
let index = 1;
let toSearch = '8.8.8.8';

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const input = form.children[0].value;
    if(isAddress.test(input)){
        //console.log('Is Address');
        index = 0;
        toSearch = input;
        updateGeo();
        return;
    }
    if(isDomain.test(input)){
        //console.log('Is Domain');
        index = 1;
        toSearch = input;
        updateGeo();
        return;
    }
    else{
        alert("Domain or Address invalid, Try again.");
        return;
    }
})


updateGeo = async() =>{
    try {
        const data = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${KEY}&${type[index]}=${toSearch}`)
        .then(response=>response.json()).then(resJSON => resJSON)
        //console.log(data);
        if(data.location.lat === 0 && data.location.lng === 0){
            throw new Error('Ups!');
        }

        ipView.textContent = data.ip;
        locationView.textContent = data.location.region +', '+ data.location.country+' '+ data.location.postalCode;
        timezoneView.textContent = 'UTC'+data.location.timezone;
        ispView.textContent = data.isp;

        latitud = data.location.lat;
        longitud = data.location.lng;
        map.setView([latitud, longitud], zoom);
        L.marker([latitud, longitud], {icon: myIcon}).addTo(map);

    } catch (error) {
        alert('Ups! Error, Domain or Address invalid, Try again later.')
    }
}

let map = L.map('map');
map.setView([latitud, longitud], zoom);

L.tileLayer('https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=SwkzvKcAB9BWP5okIraZ', {
    maxZoom: 19,
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(map);

var myIcon = L.icon({
    iconUrl: '/assets/images/icon-location.svg',
    iconSize: [46, 56],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
});

L.marker([latitud, longitud], {icon: myIcon}).addTo(map);
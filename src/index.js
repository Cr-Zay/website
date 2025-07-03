var map=null;

function setupMap() { //code taken from api example
    if(map===null){
        map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    }
}

async function geocodeCity() {
    const city = document.getElementById('cityInput').value;
    const apiKey = '065f831a991d46a6a5e65a3e92845767'; // Replace with your real key

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;

        const ne = data.results[0].bounds.northeast;
        const sw = data.results[0].bounds.southwest;
        drawPolygon(ne, sw);
      
        map.setView([lat, lng], 13);
        map.fitBounds([ne, sw]);

        getWeather(lat, lng);

        document.getElementById('result').innerHTML = `<b>Latitude:</b> ${lat}, <b>Longitude:</b> ${lng}`;
    } else {
        document.getElementById('result').innerHTML = '<b>Location not found.</b>';
    }
    
}

let polygon = null;
function drawPolygon(ne, sw) {
    if (polygon) {
        map.removeLayer(polygon);
    }

    polygon = L.polygon([
        [ne.lat, ne.lng],
        [ne.lat, sw.lng],
        [sw.lat, sw.lng],
        [sw.lat, ne.lng]
    ]).addTo(map);
}

async function getWeather(lat, lng){
    const apiKey = 'f30604d8cef44999d18051c695886836'; // Replace with your real key

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`;

    console.log(url);

    const res = await fetch(url);
    const data = await res.json();

    document.getElementById('weather').innerHTML = "<b>Weather: </b>" + data.weather[0].main;
    document.getElementById('temp').innerHTML = "<b>Temperature: </b>" + (data.main.temp-273).toFixed(2) + "°C";
    document.getElementById('feelsLike').innerHTML = "<b>Feels like: </b>" + (data.main.feels_like-273).toFixed(2) + "°C";
    document.getElementById('humidity').innerHTML = "<b>Humidity: </b>" + (data.main.humidity).toFixed(1) + "%";
}

function buttonClick(){
    setupMap();
    geocodeCity();
}


function renderWeather(res) {
    var elTemp = document.querySelector('.temp');
    var elHumidity = document.querySelector('.humidity');
    var elSpeed = document.querySelector('.wind');
    var elWeatherType = document.querySelector('.weather-type');
    var elWeatherIcon = document.querySelector('.weather-icon');

    elTemp.innerText = 'Temperature: ' + res.data.main.temp + ' ℃';
    elHumidity.innerText = 'Humidity: ' + res.data.main.humidity + ' %';
    elSpeed.innerText = 'Wind Speed: ' + Math.round(res.data.wind.speed * 3.6) + ' Km/h';
    elWeatherType.innerText = 'Weather Type: ' + res.data.weather[0].main;
    elWeatherIcon.src = `https://openweathermap.org/img/w/${res.data.weather[0].icon}.png`;
}


function renderAddress(address) {
    var elAddress = document.querySelector('.address');
    elAddress.innerHTML = '<span class="location"> Location: </span>' + address;
}



export default {
    renderWeather,
    renderAddress
}
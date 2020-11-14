async function getWeatherData(location) {
    try {
        const fetchData = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=2e14a66e8f1dc002f6ee8b2171356f92`, {mode: 'cors'});    
        if (!fetchData.ok) {
            throw new Error(fetchData.statusText); 
        }
        const fetchDataJSON = await fetchData.json(); 
        return fetchDataJSON;        
    } catch(error) {
        alert(error)
    }
}

const weatherInfoFactory = (jsonData) => {
    const kelvinToFahrenheit = (temp) => (temp - 273.15) * 9/5 + 32;
    const kelvinToCelsius = (temp) => temp - (273.15);
    
    const getTemp = (temp, isCelsius) => {
        return isCelsius ? kelvinToCelsius(temp) : kelvinToFahrenheit(temp);
    };
    
    const getFeelsLikeTemp = (isCelsius) => {
        return getTemp(jsonData.main.feels_like, isCelsius).toFixed(1);
    };
    
    const getActualTemp = (isCelsius) => {
        return getTemp(jsonData.main.temp, isCelsius).toFixed(1);
    }
    
    return {       
        city: jsonData.name,
        country: jsonData.sys.country,
        weather: jsonData.weather[0].main,
        weatherDesc: jsonData.weather[0].description,
        humidity: jsonData.main.humidity,
        pressure: jsonData.main.pressure,
        getFeelsLikeTemp,
        getActualTemp,
    };
}

function fillWeatherInfoData(weatherData) {
    weatherLocation.textContent = `${weatherData.city}, ${weatherData.country}`;
    weatherDesc.textContent = `${weatherData.weather} | ${weatherData.weatherDesc}`;
    humidity.textContent = weatherData.humidity + '%';
    pressure.textContent = weatherData.pressure + 'hPa';
    fillTempData(weatherData);
}

function fillTempData(weatherData) {
    feelsLikeTemp.textContent = weatherData.getFeelsLikeTemp(tempsInCelsius);
    currentTemp.textContent = weatherData.getActualTemp(tempsInCelsius); 
}

async function submitWeatherForm(e) {
    e.preventDefault();
    const weatherData = await getWeatherData(locationInput.value);

    if (weatherData) {
        weatherInfo = weatherInfoFactory(weatherData);
        fillWeatherInfoData(weatherInfo);
        weatherInfoDiv.classList.remove('hidden');
    } else {
        weatherInfoDiv.classList.add('hidden');
    }
    
    e.target.reset();
}

function switchTemperatureFormat(e) {
    if (e.target.id == 'celsius-btn') {
        tempsInCelsius = true;
    } else {
        tempsInCelsius = false;
    }
    
    fillTempData(weatherInfo);
}

const weatherForm = document.querySelector('form');
const locationInput = document.querySelector('input');
const weatherInfoDiv = document.querySelector('#weather-info-div');

const currentTemp = document.querySelector('#current-temp');
const weatherLocation = document.querySelector('#location');
const weatherDesc = document.querySelector('#weather-desc');
const humidity = document.querySelector('#humidity');
const pressure = document.querySelector('#pressure');
const feelsLikeTemp = document.querySelector('#feels-like-temp');

let tempsInCelsius = true;
let weatherInfo;

weatherForm.addEventListener('submit', submitWeatherForm);
document.querySelectorAll('.temp-btn').forEach(item => {
    item.addEventListener('click', switchTemperatureFormat);
});
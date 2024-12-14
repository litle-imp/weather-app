// Script for Weather Application
const userLocation = document.getElementById("userLocation"),
      converter = document.getElementById("converter"),
      weatherIcon = document.querySelector(".weatherIcon"),
      temperature = document.querySelector(".temperature"),
      feelslike = document.querySelector(".feelslike"),
      description = document.querySelector(".description"),
      date = document.querySelector(".date"),
      city = document.querySelector(".city"),

      HValue = document.getElementById("HValue"),
      WValue = document.getElementById("WValue"),
      SRValue = document.getElementById("SRValue"),
      SSValue = document.getElementById("SSValue"),
      CValue = document.getElementById("CValue"),
      UVValue = document.getElementById("UVValue"),
      PValue = document.getElementById("PValue"),

      Forecast = document.querySelector(".Forecast");

const WEATHER_API_BASE = "https://api.openweathermap.org/data/2.5";
const API_KEY = "8ff46ddd3733a4ed1ab3616b52157148"; // Replace with your actual API key

// Function to fetch weather data
async function fetchWeatherData(cityName) {
    try {
        const url = `${WEATHER_API_BASE}/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
        console.log("Fetching Weather Data from:", url);

        const response = await fetch(url);
        const data = await response.json();

        console.log("API Response:", data); // Log the response for debugging
        if (data.cod !== 200) throw new Error(data.message);

        updateWeatherData(data);
    } catch (error) {
        console.error("Error:", error.message); // Log error details
        alert(`Error: ${error.message}`);
    }
}

// Function to update weather data in the DOM
function updateWeatherData(data) {
    weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">`;
    temperature.innerHTML = `${data.main.temp.toFixed(1)}°C`;
    feelslike.innerHTML = `Feels Like: ${data.main.feels_like.toFixed(1)}°C`;
    description.innerHTML = data.weather[0].description;
    date.innerHTML = new Date().toLocaleDateString();
    city.innerHTML = `${data.name}, ${data.sys.country}`;

    HValue.innerHTML = `${data.main.humidity}%`;
    WValue.innerHTML = `${data.wind.speed} m/s`;
    SRValue.innerHTML = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    SSValue.innerHTML = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    CValue.innerHTML = `${data.clouds.all}%`;
    UVValue.innerHTML = "N/A"; // UV index requires a separate API call
    PValue.innerHTML = `${data.main.pressure} hPa`;
}

// Function to fetch and display weekly forecast
async function fetchForecast(cityName) {
    try {
        const url = `${WEATHER_API_BASE}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`;
        console.log("Fetching Forecast Data from:", url);

        const response = await fetch(url);
        const forecastData = await response.json();

        console.log("Forecast API Response:", forecastData);
        updateForecast(forecastData);
    } catch (error) {
        console.error(`Forecast Error: ${error.message}`);
    }
}

// Function to update the forecast in the DOM
function updateForecast(data) {
    Forecast.innerHTML = "";
    const dailyData = data.list.filter(entry => entry.dt_txt.includes("12:00:00"));
    dailyData.forEach(day => {
        const forecastElement = document.createElement("div");
        forecastElement.classList.add("forecast-item");
        forecastElement.innerHTML = `
            <h3>${new Date(day.dt * 1000).toLocaleDateString()}</h3>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}">
            <p>${day.main.temp.toFixed(1)}°C</p>
            <p>${day.weather[0].description}</p>
        `;
        Forecast.appendChild(forecastElement);
    });
}

// Event listener for user location input
document.querySelector(".fa-search").addEventListener("click", () => {
    const cityName = userLocation.value.trim();
    if (cityName) {
        fetchWeatherData(cityName);
        fetchForecast(cityName);
    } else {
        alert("Please enter a city name.");
    }
});

// Event listener for temperature conversion
converter.addEventListener("change", () => {
    const currentTemp = parseFloat(temperature.innerHTML);
    if (converter.value === "°F") {
        temperature.innerHTML = `${(currentTemp * 9/5 + 32).toFixed(1)}°F`;
        feelslike.innerHTML = `Feels Like: ${(parseFloat(feelslike.innerHTML.split(' ')[2]) * 9/5 + 32).toFixed(1)}°F`;
    } else {
        temperature.innerHTML = `${((currentTemp - 32) * 5/9).toFixed(1)}°C`;
        feelslike.innerHTML = `Feels Like: ${((parseFloat(feelslike.innerHTML.split(' ')[2]) - 32) * 5/9).toFixed(1)}°C`;
    }
});

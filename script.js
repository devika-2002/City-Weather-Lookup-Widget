const cityInput = document.getElementById("cityInput");
const weatherBtn = document.getElementById("weatherBtn");

const error = document.getElementById("error");
const weather = document.getElementById("weather");

weatherBtn.addEventListener("click", function () {

    const cityName = cityInput.value;
    weather.innerHTML = "";
    error.textContent = "";

    if (cityName === "") {
        error.textContent = "Empty input";
        return;
    }

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (!data.results || data.results.length == 0) {
                error.textContent = "City not found.";
                return;
            }

            const place = data.results[0];
            const latitude = place.latitude;
            const longitude = place.longitude;
            const country = place.country;

            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (weatherData) {
                    if (!weatherData.current_weather) {
                        error.textContent = "Missing Weather data";
                        return;
                    }

                    const temp = weatherData.current_weather.temperature;
                    const wind = weatherData.current_weather.windspeed;

                    weather.innerHTML = `
                        <h3>${place.name}, ${country}</h3>
                        <p>Temperature: ${temp} °C</p>
                        <p>Windspeed: ${wind} km/h</p>
                    `;
                })
                .catch(function () {
                    error.textContent = "Failed API requests";
                });
        })
        .catch(function () {
            error.textContent = "Failed API requests";
        });
});


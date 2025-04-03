function attachEvents() {
    let endpoints = {
        getAllLocations: `http://localhost:3030/jsonstore/forecaster/`,
        currentForecast: `http://localhost:3030/jsonstore/forecaster/today/`,
        threeDayForecast: `http://localhost:3030/jsonstore/forecaster/upcoming/`
    }

    let emojis = {
        'Sunny': String.fromCodePoint(0x2600),
        'Partly sunny': String.fromCodePoint(0x26C5),
        'Overcast': String.fromCodePoint(0x2601),
        'Rain': String.fromCodePoint(0x2614)
    }

    let getWeatherBtn = document.getElementById('submit');
    let locationInputElem = document.getElementById('location');
    let forecastDiv = document.getElementById('forecast');
    let displayCurrentWeatherDiv = document.getElementById('current');
    let displayUpcomingWeatherDiv = document.getElementById('upcoming');
    
    getWeatherBtn.addEventListener('click', getLocations);
    
    async function getLocations() {
        let current = document.querySelector('div#current > div.label');
        let upcoming = document.querySelector('div#upcoming > div.label');

        let locationInput = locationInputElem.value;

        let response = await fetch(endpoints.getAllLocations);
        let data = await response.json();

        let locationObj = data.locations.find(obj => obj.name === locationInput);
        
        forecastDiv.style.display = '';
        
        try {
            current.textContent = 'Current conditions';
            upcoming.textContent = 'Three-day forecast';
            
            await getCurrentWeather(locationObj);
            await getThreeDaysForecast(locationObj);
        } catch (error) {
            current.textContent = 'Error';
            upcoming.textContent = error;

            throw new Error("try/catch | Invalid Input");
        }
    }

    async function getCurrentWeather(locationObj) {
        let response = await fetch(endpoints.currentForecast + locationObj.code);
        let data = await response.json();
        
        let currentWeatherDiv = createCurrentDiv(data);
        if (displayCurrentWeatherDiv.children[1]) {
            displayCurrentWeatherDiv.children[1].remove()
        }
        displayCurrentWeatherDiv.appendChild(currentWeatherDiv);
    }

    async function getThreeDaysForecast(locationObj) {
        let response = await fetch(endpoints.threeDayForecast + locationObj.code);
        let data = await response.json();

        let upcomingWeatherDiv = createThreeDaysForecastDiv(data.forecast)
        if (displayUpcomingWeatherDiv.children[1]) {
            displayUpcomingWeatherDiv.children[1].remove()
        }
        displayUpcomingWeatherDiv.appendChild(upcomingWeatherDiv);
        
    }

    function createCurrentDiv(data) {
        let currentWeatherDiv = document.createElement('div');
        currentWeatherDiv.classList.add('forecasts');

        let symbolSpan = createSpan(['condition', 'symbol'], emojis[data.forecast.condition]);
        let conditionSpan = createSpan(['condition']);
        
        let cityNameSpan = createSpan(['forecast-data'], data.name);
        let temperatureSpan = createSpan(['forecast-data'], `${data.forecast.low}°/${data.forecast.high}`);
        let wetherSpan = createSpan(['forecast-data'], data.forecast.condition);

        conditionSpan.appendChild(cityNameSpan);
        conditionSpan.appendChild(temperatureSpan);
        conditionSpan.appendChild(wetherSpan);

        
        currentWeatherDiv.appendChild(symbolSpan);
        currentWeatherDiv.appendChild(conditionSpan);

        return currentWeatherDiv
    }

    function createThreeDaysForecastDiv(forecastArr) {
        let upcomingWeatherDiv = document.createElement('div');
        upcomingWeatherDiv.classList.add('forecast-info');

        forecastArr.forEach(obj => {
            let mainSpan = createSpan(['upcoming']);
            let symbolSpan = createSpan(['symbol'], emojis[obj.condition]);
            let temperatureSpan = createSpan(['forecast-data'], `${obj.low}°/${obj.high}`);
            let weatherSpan = createSpan(['forecast-data'], obj.condition);

            mainSpan.appendChild(symbolSpan);
            mainSpan.appendChild(temperatureSpan);
            mainSpan.appendChild(weatherSpan);

            upcomingWeatherDiv.appendChild(mainSpan)
        });
        
        return upcomingWeatherDiv
    }

    /**
     * Creates a <span> element with specified classes and text content.
     * @param {array} classList - Array of class names to add.
     * @param {string} text - Text content of the <span>.
     * @returns {HTMLElement} The created <span> element.
     */
    function createSpan(classList, text) {
        let span = document.createElement('span');
        classList.forEach(currClass => { 
            span.classList.add(currClass)
        });
        span.textContent = text;

        return span
    }

}
attachEvents()
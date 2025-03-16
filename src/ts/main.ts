const API_SERVICE = new UserApiService();
const WEATHER_SERVICE = new Weather();
const USER_LOCATION = new UserLocation();
// ALL USER ELEMENTS
const USER_CITY = document.getElementById('user-city') as HTMLElement;
const USER_TIME = document.getElementById('user-time') as HTMLDivElement;
const USER_DAY_AND_DATE = document.getElementById('day-and-date') as HTMLDivElement;
const FIVE_DAY_FORECAST_TEMP = document.getElementsByClassName("five-day-forecast-temp") as HTMLCollectionOf<HTMLDivElement>;
const FIVE_DAY_FORECAST_DAY_DATE = document.getElementsByClassName("five-day-forecast-day-date") as HTMLCollectionOf<HTMLDivElement>;
const MAIN_TEMP = document.querySelector('.main-temp') as HTMLSpanElement;
const MAIN_TEMP_FEELS_LIKE = document.querySelector('.main-temp-feels-like') as HTMLSpanElement;
const MAIN_TEMP_SUNRISE = document.querySelector('.main-temp-sunrise') as HTMLDivElement;
const MAIN_TEMP_SUNSET = document.querySelector('.main-temp-sunset') as HTMLDivElement;
const MAIN_TEMP_HUMIDITY = document.querySelector('.main-temp-humidity') as HTMLDivElement;
const MAIN_TEMP_WIND_SPEED = document.querySelector('.main-temp-wind-speed') as HTMLDivElement;
const MAIN_TEMP_PRESSURE = document.querySelector('.main-temp-pressure') as HTMLDivElement;
const MAIN_TEMP_VISIBILITY = document.querySelector('.main-temp-visibility') as HTMLDivElement;


function kelvinToCelsius(kelvin: number) {
    if (kelvin < 0) {
        throw new Error("Temperature in Kelvin cannot be negative.");
    }
    const celsius = kelvin - 273.15;
    return Math.round(celsius);
}
function formatDate(dateString: string) {
    const date = new Date(dateString);
    // Get day name
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[date.getDay()];
    // Get day of the month
    const day = date.getDate();
    // Get month name
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[date.getMonth()];
    return `${dayName}, ${day} ${monthName}`;
}
function convertTimestampTo12HourTime(timestamp) {
    // Convert seconds to milliseconds and create a Date object
    const date = new Date(timestamp * 1000);

    // Extract hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Determine AM or PM
    const period = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12; // Convert "0" hours (midnight) to "12"

    return `${hours}:${minutes} ${period}`;
}

const convertToKmh = (speedInMps: number): number => {
    return Math.round(speedInMps * 3.6);
};



window.onload = () => {
    // GETTING USER COORDINATES //
    const location = UserLocation.getCurrentLocation();
    ///// FIRST BLOCK  START /////
    // USER CITY
    location.then((coords) => {
        const { latitude, longitude } = coords;
        const city = USER_LOCATION.getCityFromCoords(latitude, longitude);
        city.then((city) => {
            USER_CITY.innerText = city || 'Unknown City';
        });
    });
    // USER TIME
    const userTime = () => {
        const date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const time = `${hours}:${minutes}`;
        return time
    }
    const time = userTime();
    USER_TIME.innerText = time;
    // USER DAY AND DATE
    const userDateAndDate = () => {
        const date = new Date();
        const getDay = date.getDay();
        const getDate = date.getDate();
        const getMonth = date.getMonth();
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const dayName = dayNames[getDay];
        const monthName = monthNames[getMonth];
        const day = `${dayName}, ${getDate} ${monthName}`;
        return day
    }
    const dayAndDate = userDateAndDate();
    USER_DAY_AND_DATE.innerText = dayAndDate;
    ///// FIRST BLOCK  END /////

    // 5 DAY FORECAST START //
    location.then((coords) => {
        const { latitude, longitude } = coords;
        const forecast = WEATHER_SERVICE.GetFiveDayForecast(latitude, longitude);
        forecast.then((data) => {
            const forecastData = data.list;
            FIVE_DAY_FORECAST_TEMP[0].innerText = `${kelvinToCelsius(forecastData[8].main.temp)}°C`;
            FIVE_DAY_FORECAST_DAY_DATE[0].innerText = `${formatDate(forecastData[8].dt_txt)}`;
            FIVE_DAY_FORECAST_TEMP[1].innerText = `${kelvinToCelsius(forecastData[16].main.temp)}°C`;
            FIVE_DAY_FORECAST_DAY_DATE[1].innerText = `${formatDate(forecastData[16].dt_txt)}`;
            FIVE_DAY_FORECAST_TEMP[2].innerText = `${kelvinToCelsius(forecastData[24].main.temp)}°C`;
            FIVE_DAY_FORECAST_DAY_DATE[2].innerText = `${formatDate(forecastData[24].dt_txt)}`;
            FIVE_DAY_FORECAST_TEMP[3].innerText = `${kelvinToCelsius(forecastData[32].main.temp)}°C`;
            FIVE_DAY_FORECAST_DAY_DATE[3].innerText = `${formatDate(forecastData[32].dt_txt)}`;
            FIVE_DAY_FORECAST_TEMP[4].innerText = `${kelvinToCelsius(forecastData[38].main.temp)}°C`;
            FIVE_DAY_FORECAST_DAY_DATE[4].innerText = `${formatDate(forecastData[38].dt_txt)}`;
        })
    })
    // 5 DAY FORECAST END //
    // CURRENT WEATHER START //
    location.then((coords) => {
        const { latitude, longitude } = coords;
        const weather = WEATHER_SERVICE.GetWeather(latitude, longitude);
        weather.then((data) => {
            const currentWeather = data as CurrentWeatherData | undefined;
            if (currentWeather) {
                console.log(currentWeather);
                MAIN_TEMP.innerText = `${kelvinToCelsius(currentWeather.main.temp)}`;
                MAIN_TEMP_FEELS_LIKE.innerText = `${kelvinToCelsius(currentWeather.main.feels_like)}°C`;
                MAIN_TEMP_SUNRISE.innerText = `${convertTimestampTo12HourTime(currentWeather.sys.sunrise)}`;
                MAIN_TEMP_SUNSET.innerText = `${convertTimestampTo12HourTime(currentWeather.sys.sunset)}`;
                MAIN_TEMP_HUMIDITY.innerText = `${currentWeather.main.humidity}%`;
                MAIN_TEMP_WIND_SPEED.innerText = `${convertToKmh(currentWeather.wind.speed)} km/h`;
                MAIN_TEMP_PRESSURE.innerHTML = `${currentWeather.main.pressure} hPa`;
                MAIN_TEMP_VISIBILITY.innerHTML = `${currentWeather.visibility} m`;
            } else {
                console.error('Current weather data is undefined.');
            }
        }
        )
    })


    // CURRENT WEATHER END //

}
// USER PROFILE MODAL TOGGLE
const userProfile: HTMLElement | null = document.getElementById('user-profile');
const profileModal: HTMLElement | null = document.getElementById('profile-modal');

userProfile?.addEventListener('click', () => {
    if (profileModal) {
        profileModal.classList.toggle('hidden');
    }
});

// CLOSE MODAL IF CLICKED OUTSIDE
document.addEventListener('click', (event: MouseEvent) => {
    if (profileModal && !profileModal.contains(event.target as Node) && event.target !== userProfile) {
        profileModal.classList.add('hidden');
    }
});
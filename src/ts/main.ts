const USER = JSON.parse(sessionStorage.getItem("user") as string)
const flag_check = JSON.parse(sessionStorage.getItem("flash_flag") as string)
console.log(USER);


if (!USER) {
    window.location.href = "login.html"
}
else if (flag_check === true) {
    window.FlashMessage.success('Logged In Successfully', { type: 'success', timeout: 2000 });
    sessionStorage.setItem("flash_flag", "false")
}

// API INSTANCES
const USER_API_SERVICE = new UserApiService();
const WEATHER_SERVICE = new Weather();
const USER_LOCATION = new UserLocation();
const GET_LAT_LON = new getLatAndLon();
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
const MAIN_TEMP_DESCRIPTION = document.querySelector(".main-temp-description") as HTMLDivElement;
const USER_LOGOUT_BTN = document.querySelector(".user-logout-btn") as HTMLAnchorElement;
const MAIN_SEARCH_BAR = document.querySelector("#main-navbar") as HTMLInputElement
let FIVE_HOUR_PARENT = document.querySelector(".hourly-parent") as HTMLDivElement;
const favouriteBtn = document.querySelector('.favorite-btn') as HTMLButtonElement;

// FOR FAVOURITE ADDING AND UPDATING //
let mainCity: string | undefined = ""
let mainLocation = {
    latitude: 0,
    longitude: 0
}
// GETTING CURRENT DATE
function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
// CONVERTING KELVIN TO CELCIUS
function kelvinToCelsius(kelvin: number) {
    if (kelvin < 0) {
        throw new Error("Temperature in Kelvin cannot be negative.");
    }
    const celsius = kelvin - 273.15;
    return Math.round(celsius);
}

// FORMATTING DATE ACCORDING TO REQUIREMENT
function formatDate(dateString: string) {
    const date = new Date(dateString);
    // GET DAY NAME
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[date.getDay()];
    // GET DAY OF THE MONTH
    const day = date.getDate();
    // Get month name
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[date.getMonth()];
    return `${dayName}, ${day} ${monthName}`;
}

// 12 HOUR TIME 
function convertTimestampTo12HourTime(timestamp: number) {
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

// CONVERTING M TO KM
const convertToKmh = (speedInMps: number): number => {
    return Math.round(speedInMps * 3.6);
};



// COORDINATES AND RENDERING
const getWeatherAndRender = async (location: { latitude: number; longitude: number }) => {
    ///// FIRST BLOCK START /////
    try {
        // Get coordinates
        const coords = await location;
        const { latitude, longitude } = coords;
        console.log(latitude, longitude);
        mainLocation.latitude = latitude
        mainLocation.longitude = longitude
        // USER CITY
        // Get and display city name
        const city = await USER_LOCATION.getCityFromCoords(latitude, longitude);
        mainCity = city
        USER_CITY.innerText = city || 'Unknown City';
        checkFavouriteOnLoad()

        // Get and display forecast data
        const forecastResponse = await WEATHER_SERVICE.GetFiveDayForecast(latitude, longitude);
        const forecastData = (forecastResponse as any).list;

        // Update 5-day forecast
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

        // Update hourly forecast
        FIVE_HOUR_PARENT.innerHTML = "";
        for (let i = 0; i < 6; i++) {
            const e = forecastData[i];
            if (i == 5) {
                break;
            }
            if (e.dt_txt.slice(0, 10) === getCurrentDate()) {
                const hourly: string = `<div class="bg-sky-300 rounded-lg p-2 text-center theme-transition hourly-item flex flex-col justify-around">
                                    <div class="font-bold mb-1">${e.dt_txt.slice(11, 16)}</div>
                                    <div class="text-lg">${kelvinToCelsius(e.main.temp)}°C</div>
                                    <div class="text-sm mt-4">${convertToKmh(e.wind.speed)} km/h</div>
                                    </div>`;
                FIVE_HOUR_PARENT.innerHTML += hourly;
            }
        }
    } catch (error) {
        console.error('Error fetching city and forecast data:', error);
    }

    // USER TIME
    const userTime = () => {
        const date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const time = `${hours}:${minutes}`;
        return time;
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
        return day;
    }
    const dayAndDate = userDateAndDate();
    USER_DAY_AND_DATE.innerText = dayAndDate;
    ///// FIRST BLOCK END /////

    // 5 DAY AND HOUR FORECAST END //
    // CURRENT WEATHER START //
    try {
        const coords = await location;
        const { latitude, longitude } = coords;
        const weatherResponse = await WEATHER_SERVICE.GetWeather(latitude, longitude);
        const currentWeather = weatherResponse as CurrentWeatherData | undefined;

        if (currentWeather) {
            MAIN_TEMP.innerText = `${kelvinToCelsius(currentWeather.main.temp)}`;
            MAIN_TEMP_FEELS_LIKE.innerText = `${kelvinToCelsius(currentWeather.main.feels_like)}°C`;
            MAIN_TEMP_SUNRISE.innerText = `${convertTimestampTo12HourTime(currentWeather.sys.sunrise)}`;
            MAIN_TEMP_SUNSET.innerText = `${convertTimestampTo12HourTime(currentWeather.sys.sunset)}`;
            MAIN_TEMP_HUMIDITY.innerText = `${currentWeather.main.humidity}%`;
            MAIN_TEMP_WIND_SPEED.innerText = `${convertToKmh(currentWeather.wind.speed)} km/h`;
            MAIN_TEMP_PRESSURE.innerHTML = `${currentWeather.main.pressure} hPa`;
            MAIN_TEMP_VISIBILITY.innerHTML = `${currentWeather.visibility} m`;
            MAIN_TEMP_DESCRIPTION.innerHTML = `${currentWeather.weather[0].description}`;
        } else {
            console.error('Current weather data is undefined.');
        }
    } catch (error) {
        console.error('Error fetching current weather data:', error);
    }
    // CURRENT WEATHER END //
}



// GETTING NAME
const handleSearch = (event: Event) => {
    event.preventDefault()
    const event_target = event.target as HTMLFormElement
    const input_field = event_target[0] as HTMLInputElement
    const locationn = GET_LAT_LON.getLatLonFromLocation(input_field.value)
    locationn.then((coords) => {
        if (coords) {
            getWeatherAndRender(coords);
        }
    })
}

// NAVBAR //
class NavbarHandler {
    private profileDropdown: DropdownElements;
    constructor() {
        // Initialize dropdown elements
        this.profileDropdown = {
            button: document.getElementById('user-profile'),
            dropdown: document.getElementById('profile-modal'),
            isOpen: false
        };
        this.initEventListeners();
        this.initFavoritesPositioning();
    }
    private initEventListeners(): void {
        // Attach profile dropdown toggle event
        if (this.profileDropdown.button && this.profileDropdown.dropdown) {
            this.profileDropdown.button.addEventListener('click', (e: Event) => {
                e.stopPropagation();
                this.toggleProfileDropdown();
            });
            // Close dropdown when clicking outside
            document.addEventListener('click', (e: Event) => {
                const target = e.target as HTMLElement;
                if (this.profileDropdown.isOpen &&
                    this.profileDropdown.dropdown &&
                    !this.profileDropdown.dropdown.contains(target) &&
                    target !== this.profileDropdown.button) {
                    this.closeProfileDropdown();
                }
            });
        } else {
            console.error('Profile dropdown elements not found in the DOM');
        }
        // Close dropdowns when pressing Escape key
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape' && this.profileDropdown.isOpen) {
                this.closeProfileDropdown();
            }
        });
    }
    private initFavoritesPositioning(): void {
        // Get the favorites submenu
        const favoritesMenu = document.getElementById('favorites-submenu');
        if (!favoritesMenu) return;
        // Position the submenu on the left side
        favoritesMenu.classList.add('right-full');
        favoritesMenu.classList.remove('left-full');
    }
    private toggleProfileDropdown(): void {
        if (!this.profileDropdown.dropdown) return;
        if (this.profileDropdown.isOpen) {
            this.closeProfileDropdown();
        } else {
            this.openProfileDropdown();
        }
    }
    private openProfileDropdown(): void {
        if (!this.profileDropdown.dropdown) return;
        this.profileDropdown.dropdown.classList.remove('hidden');
        this.profileDropdown.isOpen = true;
        // Add aria attributes for accessibility
        if (this.profileDropdown.button) {
            this.profileDropdown.button.setAttribute('aria-expanded', 'true');
        }
    }
    private closeProfileDropdown(): void {
        if (!this.profileDropdown.dropdown) return;
        this.profileDropdown.dropdown.classList.add('hidden');
        this.profileDropdown.isOpen = false;
        // Update aria attributes
        if (this.profileDropdown.button) {
            this.profileDropdown.button.setAttribute('aria-expanded', 'false');
        }
    }
}


// LOGOUT FUNCTIONALITY 
USER_LOGOUT_BTN.addEventListener("click", () => {
    sessionStorage.clear()
    document.getElementById("profile-modal")?.classList.add("hidden")
    window.FlashMessage.success('Logged Out Successfully', { type: 'success', timeout: 2000 });
    setTimeout(() => {
        window.location.href = "login.html";
    }, 3000);
})

// COUNT DOWN FOR NO USER
function countdown(seconds: number): void {
    const intervalId = setInterval(() => {
        const countdownElement = document.querySelector(".countdown");
        if (countdownElement) {
            countdownElement.innerHTML = ""
            countdownElement.innerHTML = seconds.toString();
        }
        seconds--;
        if (seconds === -1) {
            clearInterval(intervalId);
        }
    }, 1000);
}
// MODAL FOR NO USER
function showAlert(className: string) {
    const dom = document.querySelector(`.${className}`) as HTMLDivElement;
    countdown(3)
    dom?.classList.add("block")
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        dom?.classList.remove(className, 'block');
        window.location.href = "login.html";
    }, 5000);
}
// Initialize navbar handler when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavbarHandler();
    const locationPromise = UserLocation.getCurrentLocation();
    locationPromise.then(location => {
        getWeatherAndRender(location);
    });
    // DELETING USER ACCOUNT START //
    const dltmodal = document.querySelector(".delete-modal") as HTMLDivElement
    const DeleteBtn = document.querySelector(".delete-btn")
    DeleteBtn?.addEventListener("click", () => {
        dltmodal.style.display = "block"
    })
    const confirmDeleteBtn = document.querySelector(".confirm-delete-btn") as HTMLHeadingElement
    confirmDeleteBtn.addEventListener("click", () => {
        dltmodal.style.display = "none"
        window.FlashMessage.success('User Account Deleted Successfully', { type: 'success', timeout: 2000 });
        setTimeout(() => {
            sessionStorage.clear()
            USER_API_SERVICE.DeleteUser(USER.id)
            window.location.href = "login.html";
        }, 3000);
    })
    const closeDeleteModal = document.querySelectorAll(".close-delete-modal") as NodeListOf<HTMLButtonElement>
    closeDeleteModal.forEach((element: HTMLButtonElement) => {
        element.addEventListener("click", () => {
            dltmodal.style.display = "none"
        })
    })
    // DELETING USER ACCOUNT END //
    // EDITING USER START //
    const editModal = document.querySelector(".edit-modal") as HTMLDivElement
    const editBtn = document.querySelector(".edit-btn") as HTMLDivElement
    editBtn.addEventListener("click", () => {
        const firstName = document.querySelector(".edit-first-name") as HTMLInputElement
        const lastName = document.querySelector(".edit-last-name") as HTMLInputElement
        const email = document.querySelector(".edit-email") as HTMLInputElement
        firstName.value = USER.first_name;
        lastName.value = USER.last_name;
        email.value = USER.email;
        editModal.style.display = "block";
    })
    const closeEditModal = document.querySelector(".close-edit-modal") as HTMLButtonElement
    closeEditModal.addEventListener("click", () => {
        editModal.style.display = "none"
    })
    // EDITING USER END //
    // ADDING FAVOURITE START //
    favouriteBtn.addEventListener('click', (event) => {
        event.preventDefault()
        favouriteBtn.classList.forEach(async (className) => {
            if (className === "text-white") {
                favouriteBtn.classList.remove("text-white")
                favouriteBtn.classList.add("text-yellow-500")
                const user = await USER_API_SERVICE.GetSingleFavourite(`id=${USER.id}`)
                console.log(user);
                user[0].favourites.forEach(element => {
                    if (mainCity === element.city) {
                        console.log("CITY EXISTS");
                        return
                    }
                });
                if (user?.length == 0) {
                    if (user.city === mainCity) {
                        console.log("city ALREADY EXITS");
                    }
                    const favourite: Favourite = {
                        id: USER.id,
                        favourites: [{
                            "city": mainCity,
                            "coordinates": [mainLocation.latitude, mainLocation.longitude]
                        }]
                    }
                    console.log("FAV", favourite);
                    USER_API_SERVICE.PostFavourite(favourite)
                } else {
                    const favourite: { city: string | undefined; coordinates: number[] } = {
                        "city": mainCity,
                        "coordinates": [mainLocation.latitude, mainLocation.longitude]
                    }
                    console.log(favourite);
                    USER_API_SERVICE.PatchFavourite(favourite, USER.id)
                }

                return
            } else if (className === "text-yellow-500") {
                favouriteBtn.classList.add("text-white")
                favouriteBtn.classList.remove("text-yellow-500")
            }
        })
    });
    // ADDING FAVOURITE END //
});

// Function to check if the current location is a favorite during page load
const checkFavouriteOnLoad = async () => {
    try {
        const user = await USER_API_SERVICE.GetSingleFavourite(`id=${USER.id}`);
        if (user.length > 0) {
            const userFavourites = user[0].favourites;
            const locationExists = userFavourites.some(
                (fav: { city: string; coordinates: number[] }) => {
                    return fav.city === mainCity
                }
            );
            debugger
            if (locationExists) {
                debugger
                favouriteBtn.classList.remove("text-white");
                favouriteBtn.classList.add("text-yellow-500");
            } else {
                debugger
                favouriteBtn.classList.add("text-white");
                favouriteBtn.classList.remove("text-yellow-500");
            }
        }
    } catch (error) {
        console.error("Error checking favorite on load:", error);
    }
};







// UPDATING USER START //
const handleUpdate = (event: Event) => {
    event.preventDefault()
    const eventTarget = event.target as HTMLFormElement;
    const first_name = eventTarget[0] as HTMLInputElement;
    const last_name = eventTarget[1] as HTMLInputElement;
    const name: PatchUser = {
        first_name: first_name.value,
        last_name: last_name.value,
    };
    USER_API_SERVICE.PatchUser(name, USER.id)
    USER.first_name = first_name.value
    USER.last_name = last_name.value
    sessionStorage.setItem("user", JSON.stringify(USER))
}
// UPDATING USER END//

// USER PROFILE DETAILS START //
const userPhoto = document.querySelector(".user-profile") as HTMLSpanElement
userPhoto.innerHTML = USER.first_name.slice(0, 1).toUpperCase()
const userName = document.querySelector(".user-name") as HTMLSpanElement
const fullName = USER.first_name + " " + USER.last_name
userName.innerText = fullName.slice(0, 10) + "..."
const userEmail = document.querySelector(".user-email") as HTMLSpanElement
userEmail.innerText = USER.email.slice(0, 13) + "..."
// USER PROFILE DETAILS END//

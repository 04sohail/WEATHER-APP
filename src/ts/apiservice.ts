class UserApiService {
    API_URL: string = "http://localhost:3000";
    API_URL_USERS: string = "http://localhost:3000/users"
    LOADING_SCREEN: HTMLElement = document.querySelector(".fullScreen") as HTMLDivElement;
    WEATHER_API_KEY: string = "492893deed7dcba52a4ea95768802f3a";
    // GET SINGLE USER
    async GetSingleUser(endPoint: string): Promise<Object[] | undefined> {
        try {
            this.LOADING_SCREEN.style.display = "block";
            const API_response = await fetch(`${this.API_URL_USERS}?${endPoint}`);
            if (API_response.ok) {
                this.LOADING_SCREEN.style.display = "none";
            }
            const user: Object[] = await API_response.json();
            return user;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    };
    // POSTING USER TO API 
    async PostUser(user: User, endPoint: string | null): Promise<void> {
        try {
            this.LOADING_SCREEN.style.display = "block";
            const API_RESPONSE: Response = await fetch(`${this.API_URL}/${endPoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            if (API_RESPONSE.ok) {
                this.LOADING_SCREEN.style.display = "none";
            }
        } catch (error) {
            console.error(error);
        }
    };
}

// GETTING USER LOCATION //
class UserLocation extends UserApiService {
    // GETTING CURRENT COORDINATES //
    static async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
        if (!navigator.geolocation) {
            throw new Error("Geolocation is not supported by your browser.");
        }
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                (error) => {
                    reject(new Error(`Failed to retrieve location: ${error.message}`));
                }
            );
        });
    }
    // GETTING CITY FROM COORDINATES //
    async getCityFromCoords(lat: number, lon: number): Promise<string | undefined> {
        const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.WEATHER_API_KEY}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data && data.length > 0) {
                const city = data[0].name;
                return city;
            } else {
                throw new Error("City not found");
            }
        } catch (error) {
            console.error("Error fetching city:", error);
            // return "Error fetching city";
        }
    };
}

class Weather extends UserApiService {

    // CURRENT WEATHER //
    async GetWeather(lat: number, lon: number,): Promise<JSON | undefined> {
        try {
            this.LOADING_SCREEN.style.display = "block";
            const API_response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.WEATHER_API_KEY}`);
            if (API_response.ok) {
                this.LOADING_SCREEN.style.display = "none";
            }
            const weather: JSON = await API_response.json();
            return weather;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    };

    // GET 5 DAYS FORECAST 
    async GetFiveDayForecast(lat: number, lon: number): Promise<JSON | undefined> {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.WEATHER_API_KEY}`
        try {
            this.LOADING_SCREEN.style.display = "block";
            const API_response = await fetch(url);
            if (API_response.ok) {
                this.LOADING_SCREEN.style.display = "none";
            }
            const weather: JSON = await API_response.json();
            return weather;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    };
}


// FETCH LATITUDE AND LONGITUDE FROM LOCATION NAME
class getLatAndLon extends UserApiService {
    // FUNCTION TO FETCH LATITUDE AND LONGITUDE FROM LOCATION NAME
    async getLatLonFromLocation(locationName: string): Promise<{ latitude: number; longitude: number } | null> {
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationName)}&limit=1&appid=${this.WEATHER_API_KEY}`;
        try {
            const response = await fetch(url);
            const data: GeoLocation[] = await response.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0]; // EXTRACT LATITUDE AND LONGITUDE
                console.log(lat, lon);
                debugger;
                return { latitude: lat, longitude: lon };
            } else {
                throw new Error("Location not found!");
            }
        } catch (error) {
            console.error("Error fetching geocoding data:", (error as Error).message);
            return null;
        }
    }
}

// EXAMPLE USAGE
new getLatAndLon().getLatLonFromLocation("dubai")
    .then((coords) => {
        if (coords) {
            console.log(`Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`);
        } else {
            console.log("Coordinates could not be retrieved.");
        }
    })
    .catch((error) => console.error(error));

class UserApiService {
    API_URL: string = "http://localhost:3000";
    API_URL_USERS: string = "http://localhost:3000/users"
    API_URL_FAVOURITE: string = "http://localhost:3000/favourites"
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
    // GET SINGLE USER
    async GetSingleFavourite(endPoint: string): Promise<Object[] | undefined> {
        try {
            this.LOADING_SCREEN.style.display = "block";
            const API_response = await fetch(`${this.API_URL_FAVOURITE}?${endPoint}`);
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
    async PostUser(user: any, endPoint: string | null): Promise<void> {
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
    // POSTING USER TO API 
    async PostFavourite(favourite: any): Promise<void> {
        try {
            this.LOADING_SCREEN.style.display = "block";
            const API_RESPONSE: Response = await fetch(`${this.API_URL_FAVOURITE}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(favourite),
            });
            if (API_RESPONSE.ok) {
                this.LOADING_SCREEN.style.display = "none";
            }
        } catch (error) {
            console.error(error);
        }
    };
    // DELETING USER
    async DeleteUser(id: number): Promise<void> {
        try {
            this.LOADING_SCREEN.style.display = "block";
            const API_RESPONSE: Response = await fetch(`${this.API_URL_USERS}/${id}`, {
                method: "delete"
            })
            if (API_RESPONSE.ok) {
                this.LOADING_SCREEN.style.display = "none";
                window.FlashMessage.success('User Account Deleted Successfully', { type: 'success', timeout: 2000 });
            }
        } catch {
            console.error("User Id Not Found")
        }
    }
    // PATCHING USER TO API //
    async PatchUser(user: PatchUser, endPoint: string) {
        try {
            this.LOADING_SCREEN.style.display = "block";
            const API_RESPONSE = await fetch(`${this.API_URL_USERS}/${endPoint}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "first_name": user.first_name,
                    "last_name": user.last_name
                }),
            });
            if (API_RESPONSE.ok) {
                this.LOADING_SCREEN.style.display = "none";
            }
        } catch (error) {
            console.error(error);
        }
    };
    // PATCHING FAVOURITE TO API //
    async PatchFavourite(favourite: { city: string; coordinates: number[] }, endPoint: string) {
        try {
            this.LOADING_SCREEN.style.display = "block";
            const user = await this.GetSingleFavourite(`id=${endPoint}`)
            const updatedFavourites = user[0]
            updatedFavourites.favouriteList.push(favourite)
            console.log(updatedFavourites);
            debugger


            // Send PATCH request
            const patchResponse = await fetch(apiUrl, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ favouriteList: updatedFavourites }),
            });

            // Handle PATCH response
            if (patchResponse.ok) {
                console.log("Favourite added successfully.");
            } else {
                const errorData = await patchResponse.json();
                console.error("Failed to update favouriteList:", errorData);
            }
        } catch (error) {
            console.error("Error adding to favouriteList:", error);
        } finally {
            // Hide loading screen (optional)
            this.LOADING_SCREEN.style.display = "none";
        }
    }

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

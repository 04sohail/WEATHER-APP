interface ValidationResult {
    isValid: boolean;
    errorMessage: string;
}

type User = {
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
};

interface CurrentWeatherData {
    coord: {
        lon: number;
        lat: number;
    };
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
    base: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level?: number;
        grnd_level?: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
        gust?: number;
    };
    rain?: {
        "1h"?: number;
        "3h"?: number;
    };
    clouds: {
        all: number;
    };
    dt: number;
    sys: {
        type?: number;
        id?: number;
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
}


interface WeatherForecast {
    cod: string;
    message: number;
    cnt: number;
    list: WeatherData[];
    city: CityInfo;
}

interface WeatherData {
    dt: number;
    main: MainWeatherData;
    weather: WeatherDescription;
    clouds: Clouds;
    wind: Wind;
    visibility: number;
    pop: number;
    sys: Sys;
    dt_txt: string;
}

interface MainWeatherData {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
}

interface WeatherDescription {
    id: number;
    main: string;
    description: string;
    icon: string;
}

interface Clouds {
    all: number;
}

interface Wind {
    speed: number;
    deg: number;
    gust: number;
}

interface Sys {
    pod: string;
}

interface CityInfo {
    id: number;
    name: string;
    coord: Coordinates;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
}

interface Coordinates {
    lat: number;
    lon: number;
}

interface DropdownElements {
    button: HTMLElement | null;
    dropdown: HTMLElement | null;
    isOpen: boolean;
}

interface GeoLocation {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
}

interface DropdownElements {
    button: HTMLElement | null;
    dropdown: HTMLElement | null;
    isOpen: boolean;
}

interface Location {
    latitude: number;
    longitude: number
}

interface Window {
    FlashMessage: {
        success: (message: string, options: { type: string; timeout: number }) => void;
    };
}

interface PatchUser {
    first_name: string,
    last_name: string
}

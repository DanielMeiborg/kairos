export interface WeatherData {
    lat: number
    lon: number
    timezone: string
    timezone_offset: number
    current: Current
    hourly: Hourly[]
    daily: Daily[]
}

export interface Current {
    dt: number
    sunrise: number
    sunset: number
    temp: number
    feels_like: number
    pressure: number
    humidity: number
    dew_point: number
    uvi: number
    clouds: number
    rain: number,
    visibility: number
    wind_speed: number
    wind_deg: number
    wind_gust: number
    weather: Weather[]
}

export interface Weather {
    id: number
    main: string
    description: string
    icon: string
}

export interface Hourly {
    dt: number
    temp: number
    feels_like: number
    pressure: number
    humidity: number
    dew_point: number
    uvi: number
    clouds: number
    visibility: number
    wind_speed: number
    wind_deg: number
    wind_gust: number
    weather: Weather[]
    pop: number
}

export interface Daily {
    dt: number
    sunrise: number
    sunset: number
    moonrise: number
    moonset: number
    moon_phase: number
    temp: Temp
    feels_like: FeelsLike
    pressure: number
    humidity: number
    dew_point: number
    wind_speed: number
    wind_deg: number
    wind_gust: number
    weather: Weather[]
    clouds: number
    pop: number
    uvi: number
}

export interface Temp {
    day: number
    min: number
    max: number
    night: number
    eve: number
    morn: number
}

export interface FeelsLike {
    day: number
    night: number
    eve: number
    morn: number
}

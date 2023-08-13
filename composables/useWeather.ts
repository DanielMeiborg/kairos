import { WeatherData } from 'types/weather';
import { Geocoding } from "types/location"

export default async function () {
  let location = $(useState<Geocoding>('location'));
  if (!location) {
    const current_location = await useCurrentLocation();
    location = current_location;
  }
  const api_key = await useApiKey();
  const { data } = $(await useFetch<WeatherData>(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&exclude=minutely&lon=${location.lon}&appid=${api_key}`
  ));
  if (!data) {
    throw new Error("Fetching weather data failed");
  }
  return $$(data).value;
}

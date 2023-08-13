import { Geocoding } from "~~/types/location";

export default async function (city: string) {
    const api_key = await useApiKey();
    const { data } = $(await useFetch<Geocoding[]>(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&&appid=${api_key}`
    ));
    if (!data) {
        return null;
    }
    return data;
}

import { Geocoding } from "types/location";

export default async function (latitude: number, longitude: number) {
    const api_key = await useApiKey();
    const { data } = $(await useFetch<Geocoding[]>(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`
    ));
    if (!data) {
        return null;
    }
    return data;
}

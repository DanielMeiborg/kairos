import { Geolocation } from '@capacitor/geolocation';
import { Geocoding } from "types/location"

export default async function () {
    const position = await Geolocation.getCurrentPosition();
    const reverse_geocoding = await useReverseGeocoding(position.coords.latitude, position.coords.longitude) || null;
    return { name: reverse_geocoding ? reverse_geocoding[0].name : undefined, lat: position.coords.latitude, lon: position.coords.longitude } as Geocoding;
}
<template>
    <ion-icon :icon="icon"></ion-icon>
</template>

<script setup lang="ts">
import { alertCircleOutline, cloudyOutline, rainyOutline, snowOutline, sunnyOutline, thunderstormOutline, umbrellaOutline } from "ionicons/icons";
import { WeatherData } from "types/weather";

const { weather } = defineProps<{ weather: WeatherData }>();

const icon = computed(() => {
    console.log(weather?.current.weather[0].main);
    switch (weather?.current.weather[0].main) {
        case "Thunderstorm":
            return thunderstormOutline;
        case "Drizzle":
            return rainyOutline;
        case "Rain":
            return umbrellaOutline;
        case "Snow":
            return snowOutline;
        case "Clear":
            return sunnyOutline;
        case "Clouds":
            return cloudyOutline;
        default:
            return alertCircleOutline;
    };
});
</script>
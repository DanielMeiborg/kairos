<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="flex justify-between">Current Weather</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <h1 class="flex justify-center items-center w-full">
        <p class="px-2">{{ location.name }}</p>
        <WeatherIcon v-if="weather" :weather="weather" class="px-2" />
      </h1>
      <div v-if="weather">
        <ion-list>
          <StatItem label="Temperature" :stat="(weather.current.temp - 273.15).toFixed(2) + ' °C'" />
          <StatItem label="Humidity" :stat="weather.current.humidity + ' %'" />
          <StatItem label="Clouds" :stat="weather.current.clouds + ' %'" />
          <StatItem label="Wind" :stat="weather.current.wind_speed + ' m/s'" />
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { Geocoding } from 'types/location';

definePageMeta({
  alias: "/weather",
  middleware: ["tab"]
});

const handleRefresh = (event: any) => {
  refresh()
  event.target?.complete();
};

let location = $(useState<Geocoding>('location'));
if (!location) {
  location = await useCurrentLocation();
}
let { data: weather, refresh } = $(useAsyncData(useWeather));
watch(location, refresh);
</script>
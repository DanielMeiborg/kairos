<template>
  <ion-app>
    <ion-tabs>
      <ion-router-outlet />
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="weather" href="/">
          <ion-icon :icon="cloudOutline" :class="get_color('weather')"></ion-icon>
          <ion-label :class="get_color('weather')">Weather</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="bluetooth" href="/bluetooth">
          <ion-icon :icon="bluetoothOutline" :class="get_color('bluetooth')"></ion-icon>
          <ion-label :class="get_color('bluetooth')">Bluetooth</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="forecast" href="/forecast">
          <ion-icon :icon="barChartOutline" :class="get_color('forecast')"></ion-icon>
          <ion-label :class="get_color('forecast')">Forecast</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="location" href="/location">
          <ion-icon :icon="mapOutline" :class="get_color('location')"></ion-icon>
          <ion-label :class="get_color('location')"> location </ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-app>
</template>

<script script setup lang ="ts">
import { cloudOutline, bluetoothOutline, barChartOutline, mapOutline } from "ionicons/icons";

const route = $(useState("current_tab", () => "index"));

const current_tab = $computed(() => {
  if (route === "index") {
    return "weather";
  } else {
    return route;
  }
});


const selected_color = "text-blue-500";
const unselected_color = "text-gray-500";

const get_color = (tab: string) => {
  if (tab === current_tab) {
    return selected_color;
  } else {
    return unselected_color;
  }
};

onMounted(() => {
  // Use matchMedia to check the user preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  toggleDarkTheme(prefersDark.matches);

  // Listen for changes to the prefers-color-scheme media query
  prefersDark.addListener((mediaQuery) => toggleDarkTheme(mediaQuery.matches));

  // Add or remove the "dark" class based on if the media query matches
  function toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
  }
});
</script>
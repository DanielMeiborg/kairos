<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Change Location</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <h1 class="flex justify-center items-center w-full">{{ global_location.name }}</h1>
            <ion-toolbar>
                <ion-searchbar v-model="city" :animated="true" show-cancel-button="focus" :debounce="500"
                    @ion-change="refresh()"></ion-searchbar>
            </ion-toolbar>
            <ion-button v-if="city === ''" expand="block" @click="use_current_location()">
                Use Current Location
            </ion-button>
            <ion-list v-if="city !== ''">
                <ion-card v-for="location in locations" :key="location.name">
                    <ion-card-header>
                        <ion-card-title>{{ location.name }}</ion-card-title>
                        <ion-card-subtitle>{{ location.country }}</ion-card-subtitle>
                    </ion-card-header>
                    <ion-card-content>
                        <div class="flex flex-col items-center w-full">
                            <div class="w-full flex justify-between items-center">
                                <ion-label>Latitude</ion-label>
                                <ion-badge slot="end">{{ location.lat }}</ion-badge>
                            </div>
                            <div class="w-full flex justify-between items-center">
                                <ion-label>Longitude</ion-label>
                                <ion-badge slot="end">{{ location.lon }}</ion-badge>
                            </div>
                        </div>
                    </ion-card-content>
                    <ion-button @click="select_location(location)" fill="clear">Select</ion-button>
                </ion-card>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { Geocoding } from "types/location"

definePageMeta({
    middleware: ["tab"]
});

let global_location = $(useState<Geocoding>("location"));

const use_current_location = async () => {
    global_location = await useCurrentLocation();
    city = "";
};

use_current_location();

const select_location = (location: Geocoding) => {
    global_location = location;
    city = "";
};

let city = $ref("");

const { data: locations, pending, refresh, error } = $(useAsyncData(async () => {
    if (city === "") return [];
    return useGeocoding(city);
}));
</script>

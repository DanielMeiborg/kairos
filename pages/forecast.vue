<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Daily Weather Forecast</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>
            <h1 class="flex justify-center items-center w-full">{{ location.name }}</h1>
            <div v-if="weather" class="flex flex-col items-center p-2">
                <Line :data="temperature" class="max-w-screen-md py-2" />
                <Line :options="{ scales: { y: { suggestedMin: 0, suggestedMax: 100 } } }" :data="precipitation"
                    class="max-w-screen-md py-2" />
                <Line :options="{ scales: { y: { suggestedMin: 0, suggestedMax: 100 } } }" :data="humidity"
                    class="max-w-screen-md py-2" />
                <Line :options="{ scales: { y: { suggestedMin: 0, suggestedMax: 100 } } }" :data="clouds"
                    class="max-w-screen-md py-2" />
                <Line :data="wind_speed" class="max-w-screen-md py-2" />
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { Daily } from "types/weather";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { Geocoding } from "types/location";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

definePageMeta({
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

watch(location, async () => {
    refresh();
});

const base_week_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const date = new Date();
const week_days = base_week_days.slice(date.getDay()).concat(base_week_days.slice(0, date.getDay()));

let { data: weather, refresh } = $(useAsyncData(useWeather));

const temperature = $computed(() => {
    return {
        labels: week_days,
        datasets: [
            {
                label: "Temperature",
                data: weather?.daily.map((day: Daily) => day.temp.day - 273.15) || [],
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
                pointBackgroundColor: "rgba(255, 99, 132, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(255, 99, 132, 1)"
            }
        ]
    }
});

const precipitation = $computed(() => {
    return {
        labels: week_days,
        datasets: [
            {
                label: "Precipitation",
                data: weather?.daily.map((day: Daily) => day.pop * 100) || [],
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                pointBackgroundColor: "rgba(54, 162, 235, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(54, 162, 235, 1)"
            }
        ]
    }
});

const humidity = $computed(() => {
    return {
        labels: week_days,
        datasets: [
            {
                label: "Humidity",
                data: weather?.daily.map((day: Daily) => day.humidity) || [],
                backgroundColor: "rgba(255, 206, 86, 0.2)",
                borderColor: "rgba(255, 206, 86, 1)",
                borderWidth: 1,
                pointBackgroundColor: "rgba(255, 206, 86, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(255, 206, 86, 1)"
            }
        ]
    }
});

const clouds = $computed(() => {
    return {
        labels: week_days,
        datasets: [
            {
                label: "Clouds",
                data: weather?.daily.map((day: Daily) => day.clouds) || [],
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
                pointBackgroundColor: "rgba(153, 102, 255, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(153, 102, 255, 1)"
            }
        ]
    }
});

const wind_speed = $computed(() => {
    return {
        labels: week_days,
        datasets: [
            {
                label: "Wind Speed",
                data: weather?.daily.map((day: Daily) => day.wind_speed) || [],
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                pointBackgroundColor: "rgba(75, 192, 192, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(75, 192, 192, 1)"
            }
        ]
    }
});
</script>

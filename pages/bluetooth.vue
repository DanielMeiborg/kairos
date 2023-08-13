<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Bluetooth</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-button id="open-modal" expand="block" @click="scan" class="my-2" v-show="!connected_device">
                Connect to a device
            </ion-button>
            <ion-button id="open-modal" expand="block" @click="disconnect" v-show="connected_device"
                class="my-2">Disconnect</ion-button>
            <ion-button expand="block" @click="clear" class="my-2"
                :disabled="sensor_data.length == 0">Clear</ion-button>
            <ion-button expand="block" @click="share" class="my-2" :disabled="sensor_data.length == 0">Export as
                CSV</ion-button>
            <ion-list v-if="sensor_data.length > 0">
                <Line :data="temperature_graph" />
                <Line :data="humidity_graph" />
            </ion-list>
            <ion-modal ref="modal" trigger="open-modal" :initial-breakpoint="0.75" :breakpoints="[0, 0.75, 1]">
                <ion-header>
                    <ion-toolbar>
                        <ion-buttons slot="start">
                            <ion-button @click="cancel">Cancel</ion-button>
                        </ion-buttons>
                        <ion-title>Select a device</ion-title>
                    </ion-toolbar>
                </ion-header>
                <ion-content>
                    <ion-list>
                        <ion-item v-for="device in devices" :key="device.id">
                            <ion-label>
                                <ion-button expand="block" @click="connect(device)">{{ device.name }}</ion-button>
                            </ion-label>
                        </ion-item>
                    </ion-list>
                </ion-content>
            </ion-modal>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { BleClient } from '@capacitor-community/bluetooth-le';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Geocoding } from 'types/location';
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

let location = $(useState<Geocoding>('location'));
if (!location) {
    location = await useCurrentLocation();
}

interface Device {
    id: string;
    name: string;
}

type OptionalDevice = Device | null;

const service_uuid = "F3BCE4E1-D739-4955-815A-E69339659FEA";
const characteristic_uuid = "DE108DA1-E6D1-4CF7-B0A9-36417C10990C";

let devices = $ref<Device[]>([] as Device[]);
let modal = ref();
let connected_device = $ref<OptionalDevice>(null);

let sensor_data = $ref<{ temperature: number, humidity: number, time: Date }[]>([]);

const temperature_graph = $computed(() => {
    return {
        labels: sensor_data.map((_, index) => index),
        datasets: [
            {
                label: "Temperature",
                data: sensor_data.map((data) => data.temperature),
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
                pointBackgroundColor: "rgba(255, 99, 132, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(255, 99, 132, 1)"
            },
        ],
    };
});

const humidity_graph = $computed(() => {
    return {
        labels: sensor_data.map((_, index) => index),
        datasets: [
            {
                label: "Humidity",
                data: sensor_data.map((data) => data.humidity),
                backgroundColor: "rgba(255, 206, 86, 0.2)",
                borderColor: "rgba(255, 206, 86, 1)",
                borderWidth: 1,
                pointBackgroundColor: "rgba(255, 206, 86, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(255, 206, 86, 1)"
            },
        ],
    };
});

const clear = () => {
    console.log('clearing');
    sensor_data = [];
};

const scan = async () => {
    devices = [] as Device[];
    await BleClient.initialize();
    await BleClient.requestLEScan({ allowDuplicates: false }, (result) => {
        const device_id = result.device.deviceId;
        const device_name = result.device.name;
        if (devices.find((device) => device.id === device_id) || !device_name) {
            return;
        }
        devices.push({ id: device_id, name: device_name });
    });
};

async function connect(device: Device) {
    if (connected_device) {
        await BleClient.disconnect(device.id);
    }
    sensor_data = [];
    await BleClient.stopLEScan();
    console.log('stopped scanning');
    console.log("devices: ", devices);
    console.log("connecting to: ", device);
    if (modal) {
        modal.value.$el.dismiss(name, 'confirm');
    }
    await BleClient.connect(device.id);
    connected_device = device;
    BleClient.startNotifications(connected_device.id, service_uuid,
        characteristic_uuid, (data_view) => {
            const new_temperature = data_view.getFloat32(0, true);
            const new_humidity = data_view.getFloat32(4, true);
            sensor_data = [...sensor_data, { temperature: new_temperature, humidity: new_humidity, time: new Date() }];
        });
    console.log('connected');
};

const disconnect = async () => {
    if (!connected_device) {
        return;
    }
    await BleClient.disconnect(connected_device.id);
    console.log("disconnected from ", connected_device.name);
    connected_device = null;
};

async function cancel() {
    console.log('cancel');
    await BleClient.initialize();
    await BleClient.stopLEScan();
    console.log('stopped scanning');
    console.log("devices: ", devices);
    if (modal.value) {
        modal.value.$el.dismiss(null, 'cancel');
    }
};

const share = async () => {
    const csv = "temperature,humidity,time\n" + sensor_data
        .map(({ temperature, humidity, time }, index) => `${temperature},${humidity},${time.toString()}`)
        .join("\n");
    await Filesystem.writeFile({
        path: "sensor-data.csv",
        data: csv,
        directory: Directory.Cache,
        encoding: Encoding.UTF8
    });
    const uri = await Filesystem.getUri({
        directory: Directory.Cache,
        path: "sensor-data.csv"
    });
    if (await Share.canShare()) {
        await Share.share({
            url: uri.uri,
            title: "Sensor Data",
            dialogTitle: "Share Sensor Data"
        });
    } else {

    }
};
</script>

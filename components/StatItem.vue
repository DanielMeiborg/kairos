<template>
    <ion-item>
        <ion-label>
            <div class="flex justify-between">
                <p>{{ label }}</p>
                <ion-badge slot="end">{{ stat }}</ion-badge>
            </div>
        </ion-label>
    </ion-item>
</template>

<script setup lang="ts">
const { label, stat } = defineProps<{ label: string, stat: string }>();
</script>
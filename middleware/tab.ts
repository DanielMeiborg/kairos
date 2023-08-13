import { RouteRecordName } from "vue-router";

export default defineNuxtRouteMiddleware((to, from) => {
    let current_tab: RouteRecordName | null | undefined = $(useState("current_tab"));
    current_tab = to.name;
});
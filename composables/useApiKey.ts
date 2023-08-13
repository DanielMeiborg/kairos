import { alertController } from "@ionic/vue";

export default async function () {

    const api_key = localStorage.getItem("api_key");
    if (api_key) {
        return api_key;
    } else {
        const alert = await alertController.create({
            header: "API key required for open weather map",
            buttons: ["use"],
            inputs: [
                {
                    placeholder: "1234abcd",
                }
            ]
        });
        await alert.present();
        const { data } = await alert.onDidDismiss();
        localStorage.setItem("api_key", data.values[0]);
        return data.values[0];
    }
}
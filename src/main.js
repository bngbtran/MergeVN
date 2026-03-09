import { createApp } from "vue";
import App from "./App.vue";

import PrimeVue from "primevue/config";

import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

import Aura from "@primevue/themes/aura";

import "primeicons/primeicons.css";

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

app.component("Dropdown", Dropdown);
app.component("Button", Button);

app.mount("#app");

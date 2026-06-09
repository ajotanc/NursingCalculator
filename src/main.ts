/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from "vue";
import NumericInput from "@/components/NumericInput.vue";
// Plugins
import { registerPlugins } from "@/plugins";
// Components
import App from "./App.vue";

// Styles
import "unfonts.css";

const app = createApp(App);

registerPlugins(app);

app.component("NumericInput", NumericInput);

app.mount("#app");

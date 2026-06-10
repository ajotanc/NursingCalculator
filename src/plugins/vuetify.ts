/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from "vuetify";
// Styles
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
	theme: {
		defaultTheme: "dark",
		themes: {
			dark: {
				colors: {
					primary: "#187eb1",
				},
			},
			light: {
				colors: {
					primary: "#187eb1",
				},
			},
		},
		variations: {
			colors: ["primary"],
			lighten: 4,
			darken: 4,
		},
	},
});

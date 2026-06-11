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
	defaults: {
		VCard: {
			density: "compact",
			border: true,
			elevation: 0,
			style: "border-color: rgba(var(--v-theme-on-surface), 0.38)",
		},
		VDialog: {
			VCard: {
				rounded: "0",
			},
		},
		VTimelineItem: {
			width: "100%",
		},
	},
	theme: {
		defaultTheme: "light",
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

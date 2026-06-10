<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Cateteres Venosos Periféricos
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Guia de calibres, cores e indicações para Jelco / Abocath.
    </div>

    <v-row>
      <v-col cols="12" sm="6" v-for="catheter in catheters" :key="catheter.gauge">
        <v-card class="h-100" elevation="2">
          <v-card-item>
            <template v-slot:title>
              <div class="d-flex align-center justify-space-between w-100 mb-2">
                <span class="text-h5 font-weight-bold">{{ catheter.gauge }}G</span>
                <v-chip :color="catheter.colorHex" size="small" class="font-weight-bold"
                  :class="catheter.color === 'Amarelo' ? 'text-black' : 'text-white'">
                  {{ catheter.color }}
                </v-chip>
              </div>
            </template>

            <div class="d-flex justify-center my-4 pa-4 bg-grey-lighten-4 rounded border">
              <!-- SVG Catheter Icon -->
              <svg viewBox="0 0 210 40" width="100%" height="60" style="max-width: 450px;"
                xmlns="http://www.w3.org/2000/svg">

                <!-- Leftmost White Cap -->
                <path d="M 10,12 C 6,12 6,28 10,28 L 22,28 L 22,12 Z" fill="#f5f5f5" stroke="#90a4ae" stroke-width="0.5"
                  stroke-linejoin="round" />
                <!-- Ribs on Cap -->
                <line x1="14" y1="12" x2="14" y2="28" stroke="#9e9e9e" stroke-width="1" />
                <line x1="18" y1="12" x2="18" y2="28" stroke="#9e9e9e" stroke-width="1" />

                <!-- Step down grey neck -->
                <rect x="22" y="14" width="8" height="12" fill="#eceff1" stroke="#90a4ae" stroke-width="0.5" />

                <!-- Flash chamber back ring (ribbed) -->
                <rect x="30" y="13" width="12" height="14" rx="1" fill="#f5f5f5" stroke="#90a4ae" stroke-width="0.5"
                  stroke-linejoin="round" />
                <line x1="34" y1="13" x2="34" y2="27" stroke="#9e9e9e" stroke-width="1" />
                <line x1="38" y1="13" x2="38" y2="27" stroke="#9e9e9e" stroke-width="1" />

                <!-- Flash chamber barrel (long clear section) -->
                <rect x="42" y="14" width="28" height="12" fill="#eceff1" stroke="#90a4ae" stroke-width="0.5"
                  stroke-linejoin="round" />
                <!-- Inner blood flashback tube faint outline -->
                <rect x="42" y="17" width="26" height="6" fill="none" stroke="#b0bec5" stroke-width="0.5"
                  opacity="0.6" />

                <!-- Hub Connector (Clear/Grey) extending into colored part -->
                <rect x="48" y="12" width="30" height="16" fill="#eceff1" stroke="#90a4ae" stroke-width="0.5" />

                <!-- COLORED HUB -->
                <!-- Flange (the wide vertical part) -->
                <path d="M 78,6 L 81,6 Q 83,6 83,9 L 83,31 Q 83,34 81,34 L 78,34 Z" :fill="catheter.colorHex"
                  stroke="#90a4ae" stroke-width="0.5" stroke-linejoin="round" />

                <!-- Colored Body (cylinder with ribs) -->
                <rect x="83" y="11" width="6" height="18" :fill="catheter.colorHex" stroke="#90a4ae" stroke-width="0.5"
                  stroke-linejoin="round" />
                <!-- Main Body (rounded right side) -->
                <path d="M 89,13 L 106,13 Q 111,13 111,18 L 111,22 Q 111,27 106,27 L 89,27 Z" :fill="catheter.colorHex"
                  stroke="#90a4ae" stroke-width="0.5" stroke-linejoin="round" />

                <!-- Ribs on colored body -->
                <line x1="87" y1="13" x2="87" y2="27" stroke="#000000" stroke-width="0.5" opacity="0.2" />
                <line x1="91" y1="13" x2="91" y2="27" stroke="#000000" stroke-width="0.5" opacity="0.2" />

                <!-- Catheter Tip (rounded right side) -->
                <path d="M 111,17 L 122,17 Q 125,17 125,20 Q 125,23 122,23 L 111,23 Z" :fill="catheter.colorHex"
                  stroke="#90a4ae" stroke-width="0.5" stroke-linejoin="round" />

                <!-- NEEDLE -->
                <!-- Dynamic width -->
                <rect x="125" y="19" :width="(catheter.needleLen / 60) * 85" height="2" fill="#b0bec5" stroke="#90a4ae"
                  stroke-width="0.5" />
                <!-- Bevel Tip -->
                <path
                  :d="`M ${125 + (catheter.needleLen / 60) * 85},19 L ${125 + (catheter.needleLen / 60) * 85 + 7},20 L ${125 + (catheter.needleLen / 60) * 85},21 Z`"
                  fill="#b0bec5" stroke="#90a4ae" stroke-width="0.5" />
              </svg>
            </div>

            <p class="text-body-2 mb-0">{{ catheter.indication }}</p>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const catheters = [
	{
		gauge: 14,
		needleLen: 60,
		color: "Laranja",
		colorHex: "#F57C00",
		indication:
			"Trauma grave, cirurgias de grande porte, transfusão massiva. Requer veia calibrosa.",
	},
	{
		gauge: 16,
		needleLen: 60,
		color: "Cinza",
		colorHex: "#757575",
		indication: "Trauma, cirurgias, rápida reposição de fluidos ou sangue.",
	},
	{
		gauge: 18,
		needleLen: 54,
		color: "Verde",
		colorHex: "#43A047",
		indication:
			"Transfusão de hemoderivados, grandes volumes, tomografia com contraste.",
	},
	{
		gauge: 20,
		needleLen: 38,
		color: "Rosa",
		colorHex: "#D81B60",
		indication: "Uso rotineiro em adultos, medicação IV, hidratação padrão.",
	},
	{
		gauge: 22,
		needleLen: 30,
		color: "Azul",
		colorHex: "#1E88E5",
		indication: "Veias finas, idosos, quimioterapia, medicações de rotina.",
	},
	{
		gauge: 24,
		needleLen: 23,
		color: "Amarelo",
		colorHex: "#FFB300",
		indication: "Uso em pediatria, recém-nascidos, veias muito frágeis.",
	},
];
</script>

<style scoped></style>

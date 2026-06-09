<template>
  <v-container class="pa-6">
    <div class="text-h5 text-teal-darken-2 mb-4 font-weight-bold">
      Gotejamento Padrão
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Preencha o volume total e o tempo para descobrir a velocidade do gotejamento em macrogotas e microgotas.
    </div>

    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model.number="volume"
          label="Volume Total (mL)"
          type="number"
          variant="outlined"
          suffix="mL"
          min="0"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model.number="hours"
          label="Tempo (Horas)"
          type="number"
          variant="outlined"
          suffix="h"
          min="0"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model.number="minutes"
          label="Tempo (Minutos)"
          type="number"
          variant="outlined"
          suffix="min"
          min="0"
          hide-details="auto"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-row>
      <v-col cols="12" sm="6">
        <v-card color="teal-lighten-4" class="pa-4 text-center rounded-lg" elevation="0">
          <div class="text-subtitle-2 text-teal-darken-3 text-uppercase">Macrogotas</div>
          <div class="text-h3 font-weight-black text-teal-darken-4 my-2">
            {{ dropsResult }}
          </div>
          <div class="text-caption text-teal-darken-3">gotas/minuto</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card color="blue-lighten-4" class="pa-4 text-center rounded-lg" elevation="0">
          <div class="text-subtitle-2 text-blue-darken-3 text-uppercase">Microgotas</div>
          <div class="text-h3 font-weight-black text-blue-darken-4 my-2">
            {{ microDropsResult }}
          </div>
          <div class="text-caption text-blue-darken-3">microgotas/minuto</div>
        </v-card>
      </v-col>
    </v-row>

    <div class="mt-6 text-end">
      <v-btn color="grey-darken-1" variant="text" @click="resetForm">
        Limpar Valores
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const volume = ref<number | null>(null);
const hours = ref<number | null>(null);
const minutes = ref<number | null>(null);

const resetForm = (): void => {
	volume.value = null;
	hours.value = null;
	minutes.value = null;
};

const totalTimeInHours = computed<number>(() => {
	const h = hours.value ?? 0;
	const m = minutes.value ?? 0;
	return h + m / 60;
});

const dropsResult = computed<string>(() => {
	if (!volume.value || volume.value <= 0 || totalTimeInHours.value <= 0) {
		return "0";
	}
	return Math.round(volume.value / (totalTimeInHours.value * 3)).toString();
});

const microDropsResult = computed<string>(() => {
	if (!volume.value || volume.value <= 0 || totalTimeInHours.value <= 0) {
		return "0";
	}
	return Math.round(volume.value / totalTimeInHours.value).toString();
});
</script>

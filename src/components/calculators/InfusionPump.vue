<template>
  <v-container class="pa-6">
    <div class="text-h5 text-teal-darken-2 mb-4 font-weight-bold">
      Bomba de Infusão Contínua (BIC)
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Preencha os volumes da solução para obter a velocidade em mL/h.
    </div>

    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.number="ampouleVolume"
          label="Volume da(s) Ampola(s) (mL)"
          type="number"
          variant="outlined"
          suffix="mL"
          min="0"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.number="serumVolume"
          label="Volume do Soro/Diluente (mL)"
          type="number"
          variant="outlined"
          suffix="mL"
          min="0"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="hours"
          label="Tempo de Infusão (Horas)"
          type="number"
          variant="outlined"
          suffix="h"
          min="0"
          hide-details="auto"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-card color="teal-lighten-4" class="pa-6 text-center rounded-lg" elevation="0">
      <div class="text-subtitle-2 text-teal-darken-3 text-uppercase">Vazão da Bomba</div>
      <div class="text-h2 font-weight-black text-teal-darken-4 my-2">
        {{ infusionRate }}
      </div>
      <div class="text-subtitle-1 text-teal-darken-3">mL/h</div>
    </v-card>

    <div class="mt-6 text-end">
      <v-btn color="grey-darken-1" variant="text" @click="resetForm">
        Limpar Valores
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const ampouleVolume = ref<number | null>(null);
const serumVolume = ref<number | null>(null);
const hours = ref<number | null>(null);

const resetForm = (): void => {
	ampouleVolume.value = null;
	serumVolume.value = null;
	hours.value = null;
};

const infusionRate = computed<string>(() => {
	const v1 = ampouleVolume.value ?? 0;
	const v2 = serumVolume.value ?? 0;
	const totalVolume = v1 + v2;
	const h = hours.value ?? 0;

	if (totalVolume <= 0 || h <= 0) {
		return "0.0";
	}
	return (totalVolume / h).toFixed(1);
});
</script>

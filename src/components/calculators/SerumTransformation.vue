<template>
  <v-container class="pa-6">
    <div class="text-h5 text-teal-darken-2 mb-4 font-weight-bold">
      Transformação de Soro
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Calcule quantas ampolas são necessárias para atingir a concentração desejada.
    </div>

    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.number="totalVolume"
          label="Volume do Frasco (mL)"
          type="number"
          variant="outlined"
          suffix="mL"
          min="0"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.number="haveConcentration"
          label="Concentração Atual (%)"
          type="number"
          variant="outlined"
          suffix="%"
          min="0"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.number="wantConcentration"
          label="Concentração Desejada (%)"
          type="number"
          variant="outlined"
          suffix="%"
          min="0"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.number="ampouleConcentration"
          label="Concentração da Ampola (%)"
          type="number"
          variant="outlined"
          suffix="%"
          min="0"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="ampouleVolume"
          label="Volume de 1 Ampola (mL)"
          type="number"
          variant="outlined"
          suffix="mL"
          min="0"
          hide-details="auto"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-card color="teal-lighten-4" class="pa-6 text-center rounded-lg" elevation="0">
      <div class="text-subtitle-2 text-teal-darken-3 text-uppercase">Você deve adicionar</div>
      <div class="text-h3 font-weight-black text-teal-darken-4 my-2">
        {{ resultAmpoules }} ampolas
      </div>
      <div class="text-subtitle-1 text-teal-darken-3">(Total de {{ resultVolume }} mL)</div>
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

const totalVolume = ref<number | null>(null);
const haveConcentration = ref<number | null>(null);
const wantConcentration = ref<number | null>(null);
const ampouleConcentration = ref<number | null>(null);
const ampouleVolume = ref<number | null>(null);

const resetForm = (): void => {
	totalVolume.value = null;
	haveConcentration.value = null;
	wantConcentration.value = null;
	ampouleConcentration.value = null;
	ampouleVolume.value = null;
};

const calculation = computed(() => {
	const tv = totalVolume.value ?? 0;
	const hc = haveConcentration.value ?? 0;
	const wc = wantConcentration.value ?? 0;
	const ac = ampouleConcentration.value ?? 0;
	const av = ampouleVolume.value ?? 0;

	if (tv <= 0 || wc <= hc || ac <= wc || av <= 0) {
		return { ampoules: "0", volume: "0.0" };
	}

	const g1 = tv * (hc / 100);
	const g2 = tv * (wc / 100);
	const missingGrams = g2 - g1;

	const gramsPerAmpoule = av * (ac / 100);
	const numAmpoules = missingGrams / gramsPerAmpoule;
	const mLToAdd = numAmpoules * av;

	return {
		ampoules: numAmpoules.toFixed(1),
		volume: mLToAdd.toFixed(1),
	};
});

const resultAmpoules = computed(() => calculation.value.ampoules);
const resultVolume = computed(() => calculation.value.volume);
</script>

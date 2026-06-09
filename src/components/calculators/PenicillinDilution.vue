<template>
  <v-container class="pa-6">
    <div class="text-h5 text-teal-darken-2 mb-4 font-weight-bold">
      Diluição de Penicilina
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Calculadora especial que considera o volume que o soluto (pó) ocupa no frasco após diluído.
    </div>

    <v-row>
      <v-col cols="12" sm="6">
        <v-select
          v-model="presentation"
          :items="[5000000, 10000000]"
          label="Apresentação do Frasco (UI)"
          variant="outlined"
          suffix="UI"
          hide-details="auto"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.number="diluent"
          label="Solvente/Água Adicionada (mL)"
          type="number"
          variant="outlined"
          suffix="mL"
          min="0"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="prescription"
          label="Prescrição Médica (UI)"
          type="number"
          variant="outlined"
          suffix="UI"
          min="0"
          hide-details="auto"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-card color="teal-lighten-4" class="pa-6 text-center rounded-lg" elevation="0">
      <div class="text-subtitle-2 text-teal-darken-3 text-uppercase">Você deve aspirar</div>
      <div class="text-h2 font-weight-black text-teal-darken-4 my-2">
        {{ resultVolume }}
      </div>
      <div class="text-subtitle-1 text-teal-darken-3">mL do frasco reconstituído</div>
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

const presentation = ref<number>(5000000);
const diluent = ref<number | null>(8);
const prescription = ref<number | null>(null);

const resetForm = (): void => {
	presentation.value = 5000000;
	diluent.value = 8;
	prescription.value = null;
};

const resultVolume = computed<string>(() => {
	const pres = presentation.value;
	const dil = diluent.value ?? 0;
	const presc = prescription.value ?? 0;

	if (dil <= 0 || presc <= 0) {
		return "0.0";
	}

	// 5.000.000 UI expands 2mL. 10.000.000 UI expands 4mL.
	const powderVolume = pres === 5000000 ? 2 : 4;
	const totalVolume = dil + powderVolume;

	return ((presc * totalVolume) / pres).toFixed(2);
});
</script>

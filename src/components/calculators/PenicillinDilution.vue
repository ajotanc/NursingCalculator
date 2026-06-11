<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Diluição de Penicilina
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Calculadora especial que considera o volume que o soluto (pó) ocupa no frasco após diluído.
    </div>

    <v-row>
      <v-col cols="12" sm="6">
        <v-select v-model="presentation" :items="[5000000, 10000000]" label="Apresentação do Frasco (UI)"
          variant="outlined" suffix="UI" hide-details="auto"></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <NumericInput v-model.number="diluent" label="Solvente/Água Adicionada (mL)" variant="outlined" suffix="mL"
          min="0" hide-details="auto"></NumericInput>
      </v-col>
      <v-col cols="12">
        <NumericInput v-model.number="prescription" label="Prescrição Médica (UI)" variant="outlined" suffix="UI"
          min="0" hide-details="auto"></NumericInput>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-card color="primary-lighten-4" class="pa-6 text-center rounded">
      <div class="text-subtitle-2 text-primary-darken-1 text-uppercase">Você deve aspirar</div>
      <div class="text-h2 font-weight-black text-primary-darken-2 my-2">
        {{ resultVolume }}
      </div>
      <div class="text-subtitle-1 text-primary-darken-1">mL do frasco reconstituído</div>
    </v-card>

    <CalculatorActions
      @copy="copyToClipboard('PenicillinDilution', `Diluição de Penicilina:\nFrasco: ${presentation} UI\nPrescrição: ${prescription || 0} UI\nAdministrar: ${resultVolume} mL`)"
      @reset="resetForm" />
  </v-container>
</template>

<script setup lang="ts">
import CalculatorActions from "@/components/CalculatorActions.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";

const { copyToClipboard } = useAppClipboard();

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

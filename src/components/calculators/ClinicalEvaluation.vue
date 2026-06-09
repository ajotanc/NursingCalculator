<template>
  <v-container class="pa-6">
    <div class="text-h5 text-teal-darken-2 mb-4 font-weight-bold">
      Avaliação Clínica (IMC e SC)
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Calcule o Índice de Massa Corporal (IMC) e a Superfície Corporal (SC), essenciais para o ajuste de doses.
    </div>

    <v-row>
      <v-col cols="12" sm="6">
        <NumericInput
          v-model.number="weight"
          label="Peso (kg)"
          variant="outlined"
          suffix="kg"
          min="0"
          hide-details="auto"
        ></NumericInput>
      </v-col>
      <v-col cols="12" sm="6">
        <NumericInput
          v-model.number="heightCm"
          label="Altura (cm)"
          variant="outlined"
          suffix="cm"
          min="0"
          hide-details="auto"
        ></NumericInput>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-row>
      <v-col cols="12" sm="6">
        <v-card color="teal-lighten-4" class="pa-4 text-center rounded-lg h-100 d-flex flex-column justify-center" elevation="0">
          <div class="text-subtitle-2 text-teal-darken-3 text-uppercase">IMC</div>
          <div class="text-h3 font-weight-black text-teal-darken-4 my-2">
            {{ bmiResult }}
          </div>
          <div class="text-caption text-teal-darken-3 font-weight-bold">{{ bmiClassification }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card color="blue-lighten-4" class="pa-4 text-center rounded-lg h-100 d-flex flex-column justify-center" elevation="0">
          <div class="text-subtitle-2 text-blue-darken-3 text-uppercase">Superfície Corporal (Mosteller)</div>
          <div class="text-h3 font-weight-black text-blue-darken-4 my-2">
            {{ bsaResult }}
          </div>
          <div class="text-caption text-blue-darken-3">m²</div>
        </v-card>
      </v-col>
    </v-row>

    <div class="mt-6 d-flex justify-space-between align-center">
      
      <v-btn color="teal-darken-2" variant="tonal" prepend-icon="mdi-clipboard-text" @click="copyToClipboard('ClinicalEvaluation', `Avaliação Clínica:\nPeso: ${weight || 0}kg | Altura: ${heightCm || 0}cm\nIMC: ${bmiResult} (${bmiClassification})\nSuperfície Corporal: ${bsaResult} m²`)">
        Copiar
      </v-btn>
      <v-btn color="grey-darken-1" variant="text" @click="resetForm">
        Limpar Valores
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useAppClipboard } from "@/composables/useAppClipboard";

const { copyToClipboard } = useAppClipboard();

import { useLocalStorage } from "@vueuse/core";
import { computed } from "vue";

const weight = useLocalStorage<number | null>("nc-Clinical-weight", null);
const heightCm = useLocalStorage<number | null>("nc-Clinical-height", null);

const resetForm = (): void => {
	weight.value = null;
	heightCm.value = null;
};

const bmiResult = computed<string>(() => {
	if (!weight.value || !heightCm.value) return "0.0";
	const heightM = heightCm.value / 100;
	return (weight.value / (heightM * heightM)).toFixed(1);
});

const bmiClassification = computed<string>(() => {
	const bmi = Number(bmiResult.value);
	if (bmi === 0) return "-";
	if (bmi < 18.5) return "Abaixo do peso";
	if (bmi < 25) return "Peso normal";
	if (bmi < 30) return "Sobrepeso";
	if (bmi < 35) return "Obesidade Grau I";
	if (bmi < 40) return "Obesidade Grau II";
	return "Obesidade Grau III";
});

const bsaResult = computed<string>(() => {
	if (!weight.value || !heightCm.value) return "0.00";
	return Math.sqrt((weight.value * heightCm.value) / 3600).toFixed(2);
});
</script>

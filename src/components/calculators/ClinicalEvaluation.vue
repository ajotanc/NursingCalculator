<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Avaliação Clínica (IMC e SC)
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Calcule o Índice de Massa Corporal (IMC) e a Superfície Corporal (SC), essenciais para o ajuste de doses.
    </div>

    <v-row>
      <v-col cols="12" sm="6">
        <NumericInput v-model.number="weight" label="Peso (kg)" variant="outlined" suffix="kg" min="0"
          hide-details="auto"></NumericInput>
      </v-col>
      <v-col cols="12" sm="6">
        <NumericInput v-model.number="heightCm" label="Altura (cm)" variant="outlined" suffix="cm" min="0"
          hide-details="auto"></NumericInput>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-row>
      <v-col cols="12" sm="6">
        <v-card color="primary" variant="tonal"
          class="pa-4 text-center rounded h-100 d-flex flex-column justify-center">
          <div class="text-subtitle-2 text-uppercase">IMC</div>
          <div class="text-h3 font-weight-black my-2">
            {{ bmiResult }}
          </div>
          <div class="text-caption font-weight-bold">{{ bmiClassification }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card color="blue" variant="tonal" class="pa-4 text-center rounded h-100 d-flex flex-column justify-center">
          <div class="text-subtitle-2 text-uppercase">Superfície Corporal (Mosteller)</div>
          <div class="text-h3 font-weight-black my-2">
            {{ bsaResult }}
          </div>
          <div class="text-caption">m²</div>
        </v-card>
      </v-col>
    </v-row>

    <CalculatorActions
      @copy="copyToClipboard('ClinicalEvaluation', `Avaliação Clínica:\nPeso: ${weight || 0}kg | Altura: ${heightCm || 0}cm\nIMC: ${bmiResult} (${bmiClassification})\nSuperfície Corporal: ${bsaResult} m²`)"
      @reset="resetForm" />
  </v-container>
</template>

<script setup lang="ts">
import CalculatorActions from "@/components/CalculatorActions.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";

const { copyToClipboard } = useAppClipboard();

import { computed, onMounted, ref } from "vue";
import { usePatient } from "@/composables/usePatient";

const { currentPatient } = usePatient();
const weight = ref<number | null>(null);
const heightCm = ref<number | null>(null);

onMounted(() => {
	if (currentPatient.value.weight) {
		weight.value = currentPatient.value.weight;
	}
	if (currentPatient.value.height) {
		heightCm.value = currentPatient.value.height;
	}
});

const resetForm = (): void => {
	weight.value = currentPatient.value.weight;
	heightCm.value = currentPatient.value.height;
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

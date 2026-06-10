<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Calculadora Pediátrica (mg/kg)
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Calcule a dose alvo baseada no peso da criança e descubra o volume exato a ser administrado (para xaropes ou ampolas).
    </div>

    <v-row>
      <v-col cols="12" sm="6">
        <NumericInput
          v-model.number="weight"
          label="Peso da Criança (kg)"
          variant="outlined"
          suffix="kg"
          min="0"
          hide-details="auto"
        ></NumericInput>
      </v-col>
      <v-col cols="12" sm="6">
        <NumericInput
          v-model.number="dosePerKg"
          label="Dose Prescrita (mg/kg)"
          variant="outlined"
          suffix="mg/kg"
          min="0"
          hide-details="auto"
        ></NumericInput>
      </v-col>
      <v-col cols="12" sm="6">
        <NumericInput
          v-model.number="bottleDose"
          label="Concentração do Frasco (mg)"
          variant="outlined"
          suffix="mg"
          min="0"
          hide-details="auto"
        ></NumericInput>
      </v-col>
      <v-col cols="12" sm="6">
        <NumericInput
          v-model.number="bottleVolume"
          label="Volume do Frasco (mL)"
          variant="outlined"
          suffix="mL"
          min="0"
          hide-details="auto"
        ></NumericInput>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-row>
      <v-col cols="12" sm="6">
        <v-card color="blue-lighten-4" class="pa-4 text-center rounded-lg h-100 d-flex flex-column justify-center" elevation="0">
          <div class="text-subtitle-2 text-blue-darken-3 text-uppercase">Dose Alvo Total</div>
          <div class="text-h3 font-weight-black text-blue-darken-4 my-2">
            {{ targetDoseResult }}
          </div>
          <div class="text-caption text-blue-darken-3">mg</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card color="primary-lighten-4" class="pa-4 text-center rounded-lg h-100 d-flex flex-column justify-center" elevation="0">
          <div class="text-subtitle-2 text-primary-darken-1 text-uppercase">Você deve administrar</div>
          <div class="text-h2 font-weight-black text-primary-darken-2 my-2">
            {{ volumeToAdminister }}
          </div>
          <div class="text-caption text-primary-darken-1">mL</div>
        </v-card>
      </v-col>
    </v-row>

    <CalculatorActions @copy="copyToClipboard('PediatricDose', `Dose Pediátrica:\nPeso: ${weight || 0}kg | Prescrição: ${dosePerKg || 0}mg/kg\nDose Total: ${targetDoseResult}mg\nVolume a Administrar: ${volumeToAdminister} mL`)" @reset="resetForm" />
  </v-container>
</template>

<script setup lang="ts">
import CalculatorActions from "@/components/CalculatorActions.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";

const { copyToClipboard } = useAppClipboard();

import { computed, onMounted, ref } from "vue";
import NumericInput from "@/components/NumericInput.vue";
import { usePatient } from "@/composables/usePatient";

const { currentPatient } = usePatient();
const weight = ref<number | null>(null);

onMounted(() => {
	if (currentPatient.value.weight) {
		weight.value = currentPatient.value.weight;
	}
});
const dosePerKg = ref<number | null>(null);
const bottleDose = ref<number | null>(null);
const bottleVolume = ref<number | null>(null);

const resetForm = (): void => {
	weight.value = currentPatient.value.weight;
	dosePerKg.value = null;
	bottleDose.value = null;
	bottleVolume.value = null;
};

const targetDoseResult = computed<string>(() => {
	if (!weight.value || !dosePerKg.value) return "0.0";
	return (weight.value * dosePerKg.value).toFixed(1);
});

const volumeToAdminister = computed<string>(() => {
	const target = Number(targetDoseResult.value);
	if (target <= 0 || !bottleDose.value || !bottleVolume.value) return "0.0";
	return ((target * bottleVolume.value) / bottleDose.value).toFixed(2);
});
</script>

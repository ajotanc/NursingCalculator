<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Drogas Vasoativas
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Calcule a dose em mcg/kg/min a partir da vazão da bomba ou vice-versa. Ideal para Noradrenalina, Dobutamina, etc.
    </div>

    <v-row>
      <v-col cols="12" md="4">
        <NumericInput v-model.number="weight" label="Peso do Paciente (kg)" variant="outlined" suffix="kg" min="0"
          hide-details="auto"></NumericInput>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <NumericInput v-model.number="drugDose" label="Dose da Droga (mg)" variant="outlined" suffix="mg" min="0"
          hide-details="auto"></NumericInput>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <NumericInput v-model.number="solutionVolume" label="Volume da Solução" variant="outlined" suffix="mL" min="0"
          hide-details="auto"></NumericInput>
      </v-col>
    </v-row>

    <div class="pt-4 d-flex ga-2 flex-wrap">
      <v-btn size="small" variant="tonal" color="primary" @click="setPreset(16, 234)">Nora Padrão (16mg/234mL)</v-btn>
      <v-btn size="small" variant="tonal" color="primary" @click="setPreset(32, 218)">Nora Conc. (32mg/218mL)</v-btn>
      <v-btn size="small" variant="tonal" color="secondary" @click="setPreset(250, 230)">Dobutamina
        (250mg/230mL)</v-btn>
    </div>

    <v-divider class="my-6"></v-divider>

    <div class="text-subtitle-2 mb-4 text-grey-darken-1">Preencha UM dos campos abaixo para calcular o outro:</div>

    <v-row>
      <v-col cols="12" sm="6">
        <NumericInput v-model.number="infusionRate" label="Vazão na Bomba (mL/h)" variant="outlined" suffix="mL/h"
          min="0" hide-details="auto" @input="calculateFromRate"></NumericInput>
      </v-col>
      <v-col cols="12" sm="6">
        <NumericInput v-model.number="targetDose" label="Dose Alvo (mcg/kg/min)" variant="outlined" suffix="mcg/kg/min"
          min="0" hide-details="auto" @input="calculateFromDose"></NumericInput>
      </v-col>
    </v-row>

    <v-row class="mt-6" v-if="concentration > 0">
      <v-col cols="12">
        <v-card color="primary" variant="tonal" class="pa-4 text-center rounded-lg" elevation="0">
          <div class="text-subtitle-2 text-uppercase">Concentração da Solução</div>
          <div class="text-h4 font-weight-black my-2">
            {{ concentration.toFixed(1) }}
          </div>
          <div class="text-caption">mcg / mL</div>
        </v-card>
      </v-col>
    </v-row>

    <CalculatorActions @copy="copyToClipboard('VasoactiveDrugs', copyText)" @reset="resetForm" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import CalculatorActions from "@/components/CalculatorActions.vue";
import NumericInput from "@/components/NumericInput.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";
import { usePatient } from "@/composables/usePatient";

const { copyToClipboard } = useAppClipboard();
const { currentPatient } = usePatient();

const weight = ref<number | null>(null);

onMounted(() => {
	if (currentPatient.value.weight) {
		weight.value = currentPatient.value.weight;
	}
});
const drugDose = ref<number | null>(null);
const solutionVolume = ref<number | null>(null);

const infusionRate = ref<number | null>(null);
const targetDose = ref<number | null>(null);

const resetForm = (): void => {
	weight.value = currentPatient.value.weight;
	drugDose.value = null;
	solutionVolume.value = null;
	infusionRate.value = null;
	targetDose.value = null;
};

const setPreset = (dose: number, vol: number): void => {
	drugDose.value = dose;
	solutionVolume.value = vol;
};

const concentration = computed<number>(() => {
	if (!drugDose.value || !solutionVolume.value || solutionVolume.value <= 0)
		return 0;
	// mg to mcg = * 1000
	return (drugDose.value * 1000) / solutionVolume.value;
});

let isCalculating = false;

const calculateFromRate = () => {
	if (isCalculating) return;
	if (
		infusionRate.value &&
		weight.value &&
		weight.value > 0 &&
		concentration.value > 0
	) {
		isCalculating = true;
		// Dose = (Conc * Rate) / (Weight * 60)
		const calculatedDose =
			(concentration.value * infusionRate.value) / (weight.value * 60);
		targetDose.value = Number(calculatedDose.toFixed(3));
		isCalculating = false;
	} else if (!infusionRate.value) {
		targetDose.value = null;
	}
};

const calculateFromDose = () => {
	if (isCalculating) return;
	if (
		targetDose.value &&
		weight.value &&
		weight.value > 0 &&
		concentration.value > 0
	) {
		isCalculating = true;
		// Rate = (Dose * Weight * 60) / Conc
		const calculatedRate =
			(targetDose.value * weight.value * 60) / concentration.value;
		infusionRate.value = Number(calculatedRate.toFixed(1));
		isCalculating = false;
	} else if (!targetDose.value) {
		infusionRate.value = null;
	}
};

// Recalculate if base parameters change
watch([weight, drugDose, solutionVolume], () => {
	if (infusionRate.value) {
		calculateFromRate();
	} else if (targetDose.value) {
		calculateFromDose();
	}
});

const copyText = computed(() => {
	return `Drogas Vasoativas:\nPeso: ${weight.value || 0}kg\nSolução: ${drugDose.value || 0}mg em ${solutionVolume.value || 0}mL\nVazão: ${infusionRate.value || 0} mL/h\nDose: ${targetDose.value || 0} mcg/kg/min`;
});
</script>

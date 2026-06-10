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
        <NumericInput
          v-model.number="weight"
          label="Peso do Paciente (kg)"
          variant="outlined"
          suffix="kg"
          min="0"
          hide-details="auto"
        ></NumericInput>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <NumericInput
          v-model.number="drugDose"
          label="Dose da Droga (mg)"
          variant="outlined"
          suffix="mg"
          min="0"
          hide-details="auto"
        ></NumericInput>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <NumericInput
          v-model.number="solutionVolume"
          label="Volume da Solução"
          variant="outlined"
          suffix="mL"
          min="0"
          hide-details="auto"
        ></NumericInput>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <div class="text-subtitle-2 mb-4 text-grey-darken-1">Preencha UM dos campos abaixo para calcular o outro:</div>

    <v-row>
      <v-col cols="12" sm="6">
        <NumericInput
          v-model.number="infusionRate"
          label="Vazão na Bomba (mL/h)"
          variant="outlined"
          suffix="mL/h"
          min="0"
          hide-details="auto"
          @input="calculateFromRate"
        ></NumericInput>
      </v-col>
      <v-col cols="12" sm="6">
        <NumericInput
          v-model.number="targetDose"
          label="Dose Alvo (mcg/kg/min)"
          variant="outlined"
          suffix="mcg/kg/min"
          min="0"
          hide-details="auto"
          @input="calculateFromDose"
        ></NumericInput>
      </v-col>
    </v-row>

    <v-row class="mt-6" v-if="concentration > 0">
      <v-col cols="12">
        <v-card color="primary-lighten-4" class="pa-4 text-center rounded-lg" elevation="0">
          <div class="text-subtitle-2 text-primary-darken-2 text-uppercase">Concentração da Solução</div>
          <div class="text-h4 font-weight-black text-primary-darken-3 my-2">
            {{ concentration.toFixed(1) }}
          </div>
          <div class="text-caption text-primary-darken-2">mcg / mL</div>
        </v-card>
      </v-col>
    </v-row>

    <CalculatorActions @copy="copyToClipboard('VasoactiveDrugs', copyText)" @reset="resetForm" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import CalculatorActions from "@/components/CalculatorActions.vue";
import NumericInput from "@/components/NumericInput.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";

const { copyToClipboard } = useAppClipboard();

const weight = ref<number | null>(null);
const drugDose = ref<number | null>(null);
const solutionVolume = ref<number | null>(null);

const infusionRate = ref<number | null>(null);
const targetDose = ref<number | null>(null);

const resetForm = (): void => {
	weight.value = null;
	drugDose.value = null;
	solutionVolume.value = null;
	infusionRate.value = null;
	targetDose.value = null;
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

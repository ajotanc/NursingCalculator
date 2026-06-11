<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Protocolos de Alta Vigilância (MAV)
    </div>

    <v-autocomplete v-model="selectedMedicationName" :items="medications" item-title="name" item-value="name"
      label="Selecione o Fármaco" variant="outlined" prepend-inner-icon="mdi-pill" color="primary"
      clearable></v-autocomplete>

    <v-expand-transition>
      <div v-if="selectedMedication">
        <v-alert type="error" variant="tonal" class="mb-6 font-weight-bold" icon="mdi-alert" border="start">
          <div class="text-h6 mb-2">{{ selectedMedication.category }}</div>
          <div>{{ selectedMedication.safetyGuideline }}</div>
        </v-alert>

        <v-row v-if="selectedMedication.calculationType === 'mcg_kg_min'">
          <v-col cols="12" sm="6">
            <NumericInput v-model.number="patientWeight" label="Peso do Paciente (kg)" variant="outlined" suffix="kg"
              min="0" hide-details="auto"></NumericInput>
          </v-col>
          <v-col cols="12" sm="6">
            <NumericInput v-model.number="targetDose" label="Dose Alvo (mcg/kg/min)" variant="outlined" min="0"
              hide-details="auto"></NumericInput>
          </v-col>
          <v-col cols="12" sm="6">
            <NumericInput v-model.number="drugDose" label="Dose da Ampola (mg)" variant="outlined" suffix="mg" min="0"
              hide-details="auto"></NumericInput>
          </v-col>
          <v-col cols="12" sm="6">
            <NumericInput v-model.number="solutionVolume" label="Volume do Soro (mL)" variant="outlined" suffix="mL"
              min="0" hide-details="auto"></NumericInput>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12" sm="6">
            <NumericInput v-model.number="drugDose" label="Volume Total (mL)" variant="outlined" suffix="mL" min="0"
              hide-details="auto"></NumericInput>
          </v-col>
          <v-col cols="12" sm="6">
            <NumericInput v-model.number="solutionVolume" label="Tempo de Infusão (Horas)" variant="outlined" suffix="h"
              min="0" hide-details="auto"></NumericInput>
          </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <v-card color="error" class="pa-6 text-center rounded" variant="tonal">
          <div class="text-subtitle-2 text-uppercase">Vazão Recomendada</div>
          <div class="text-h2 font-weight-black my-2">
            {{ calculatedRate }}
          </div>
          <div class="text-subtitle-1">mL/h</div>
        </v-card>
        <CalculatorActions
          @copy="copyToClipboard('MavProtocols', `Protocolos MAV:\nFármaco: ${selectedMedicationName || 'Desconhecido'}\nPeso: ${patientWeight || 0}kg | Dose Alvo: ${targetDose || 0}\nAmpola: ${drugDose || 0}mg em ${solutionVolume || 0}mL de Soro\nVazão Final: ${calculatedRate} mL/h`)"
          @reset="resetForm" />
      </div>
    </v-expand-transition>
  </v-container>
</template>

<script setup lang="ts">
import CalculatorActions from "@/components/CalculatorActions.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";

const { copyToClipboard } = useAppClipboard();

import { computed, onMounted, ref, watch } from "vue";
import { usePatient } from "@/composables/usePatient";
import { medications } from "../../data/medicationList";
import type { MedicationProtocol } from "../../types/clinical";

const { currentPatient } = usePatient();

const selectedMedicationName = ref<string | null>(null);

const selectedMedication = computed(() => {
	if (!selectedMedicationName.value) return null;
	return (
		medications.find((m) => m.name === selectedMedicationName.value) || null
	);
});

const patientWeight = ref<number | null>(null);
const targetDose = ref<number | null>(null);
const drugDose = ref<number | null>(null);
const solutionVolume = ref<number | null>(null);

onMounted(() => {
	if (currentPatient.value.weight) {
		patientWeight.value = currentPatient.value.weight;
	}
});

watch(selectedMedicationName, () => {
	patientWeight.value = currentPatient.value.weight;
	targetDose.value = null;
	drugDose.value = null;
	solutionVolume.value = null;
});

const calculatedRate = computed<string>(() => {
	if (!selectedMedication.value) return "0.0";

	const w = patientWeight.value ?? 0;
	const td = targetDose.value ?? 0;
	const dd = drugDose.value ?? 0;
	const sv = solutionVolume.value ?? 0;

	if (selectedMedication.value.calculationType === "mcg_kg_min") {
		if (w <= 0 || td <= 0 || dd <= 0 || sv <= 0) return "0.0";

		// Dose da ampola em mcg
		const totalMcg = dd * 1000;
		// Concentração em mcg/mL
		const concentration = totalMcg / sv;
		// Dose por minuto
		const dosePerMin = td * w;
		// Dose por hora
		const dosePerHour = dosePerMin * 60;

		// Vazão final mL/h
		return (dosePerHour / concentration).toFixed(1);
	} else {
		// Cálculo padrão (Volume / Tempo)
		if (dd <= 0 || sv <= 0) return "0.0";
		return (dd / sv).toFixed(1);
	}
});

const resetForm = () => {
	selectedMedicationName.value = null;
	patientWeight.value = currentPatient.value.weight;
	targetDose.value = null;
	drugDose.value = null;
	solutionVolume.value = null;
};
</script>

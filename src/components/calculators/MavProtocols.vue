<template>
  <v-container class="pa-6">
    <div class="text-h5 text-teal-darken-2 mb-4 font-weight-bold">
      Protocolos de Alta Vigilância (MAV)
    </div>
    
    <v-autocomplete
      v-model="selectedMedication"
      :items="medications"
      item-title="name"
      return-object
      label="Selecione o Fármaco"
      variant="outlined"
      prepend-inner-icon="mdi-pill"
      color="teal-darken-2"
      clearable
    ></v-autocomplete>

    <v-expand-transition>
      <div v-if="selectedMedication">
        <v-alert
          type="error"
          variant="tonal"
          class="mb-6 font-weight-bold"
          icon="mdi-alert"
          border="start"
        >
          <div class="text-h6 mb-2">{{ selectedMedication.category }}</div>
          <div>{{ selectedMedication.safetyGuideline }}</div>
        </v-alert>

        <v-row v-if="selectedMedication.calculationType === 'mcg_kg_min'">
          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="patientWeight"
              label="Peso do Paciente (kg)"
              type="number"
              variant="outlined"
              suffix="kg"
              min="0"
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="targetDose"
              label="Dose Alvo (mcg/kg/min)"
              type="number"
              variant="outlined"
              min="0"
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="drugDose"
              label="Dose da Ampola (mg)"
              type="number"
              variant="outlined"
              suffix="mg"
              min="0"
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="solutionVolume"
              label="Volume do Soro (mL)"
              type="number"
              variant="outlined"
              suffix="mL"
              min="0"
              hide-details="auto"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="drugDose"
              label="Volume Total (mL)"
              type="number"
              variant="outlined"
              suffix="mL"
              min="0"
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="solutionVolume"
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

        <v-card color="error" class="pa-6 text-center rounded-lg" elevation="0" variant="tonal">
          <div class="text-subtitle-2 text-uppercase">Vazão Recomendada</div>
          <div class="text-h2 font-weight-black my-2">
            {{ calculatedRate }}
          </div>
          <div class="text-subtitle-1">mL/h</div>
        </v-card>
      </div>
    </v-expand-transition>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { medications } from "../../data/medicationList";
import type { MedicationProtocol } from "../../types/clinical";

const selectedMedication = ref<MedicationProtocol | null>(null);

const patientWeight = ref<number | null>(null);
const targetDose = ref<number | null>(null);
const drugDose = ref<number | null>(null);
const solutionVolume = ref<number | null>(null);

watch(selectedMedication, () => {
	patientWeight.value = null;
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
</script>

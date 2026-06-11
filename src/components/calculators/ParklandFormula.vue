<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Fórmula de Parkland
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Cálculo de reposição volêmica para grandes queimados nas primeiras 24 horas (Ringer Lactato).
    </div>

    <v-row>
      <v-col cols="12" sm="6">
        <NumericInput v-model.number="weight" label="Peso do Paciente" variant="outlined" suffix="kg" min="0"
          hide-details="auto" />
      </v-col>
      <v-col cols="12" sm="6">
        <NumericInput v-model.number="burnedArea" label="Superfície Queimada (SCQ)" variant="outlined" suffix="%"
          min="0" max="100" hide-details="auto" />
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-row v-if="isValid">
      <v-col cols="12">
        <v-card color="orange-lighten-4" class="pa-4 text-center rounded">
          <div class="text-subtitle-2 text-orange-darken-4 text-uppercase">Volume Total (24h)</div>
          <div class="text-h3 font-weight-black text-orange-darken-4 my-2">
            {{ totalVolume }} <span class="text-h5">mL</span>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card color="deep-orange-lighten-4" class="pa-4 text-center rounded">
          <div class="text-subtitle-2 text-deep-orange-darken-4 text-uppercase">Primeiras 8 Horas</div>
          <div class="text-h5 font-weight-bold text-deep-orange-darken-4 my-2">
            {{ halfVolume }} mL
          </div>
          <div class="text-subtitle-1 text-deep-orange-darken-4">
            Vazão: <b>{{ first8hRate }} mL/h</b>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card color="yellow-lighten-4" class="pa-4 text-center rounded">
          <div class="text-subtitle-2 text-yellow-darken-4 text-uppercase">Próximas 16 Horas</div>
          <div class="text-h5 font-weight-bold text-yellow-darken-4 my-2">
            {{ halfVolume }} mL
          </div>
          <div class="text-subtitle-1 text-yellow-darken-4">
            Vazão: <b>{{ next16hRate }} mL/h</b>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <CalculatorActions @copy="copyToClipboard('ParklandFormula', copyText)" @reset="resetForm" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
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

const burnedArea = ref<number | null>(null); // in percentage

const resetForm = (): void => {
	weight.value = currentPatient.value.weight;
	burnedArea.value = null;
};

const isValid = computed(() => {
	return (
		weight.value !== null &&
		weight.value > 0 &&
		burnedArea.value !== null &&
		burnedArea.value > 0
	);
});

// Formula = 4 * weight * percentage
const totalVolume = computed(() => {
	if (!isValid.value) return 0;
	return Math.round(4 * (weight.value ?? 0) * (burnedArea.value ?? 0));
});

const halfVolume = computed(() => {
	return Math.round(totalVolume.value / 2);
});

const first8hRate = computed(() => {
	return Math.round(halfVolume.value / 8);
});

const next16hRate = computed(() => {
	return Math.round(halfVolume.value / 16);
});

const copyText = computed(() => {
	return `Fórmula de Parkland:\nPeso: ${weight.value}kg | SCQ: ${burnedArea.value}%\nVolume Total 24h: ${totalVolume.value} mL\nPrimeiras 8h: ${halfVolume.value} mL (${first8hRate.value} mL/h)\nÚltimas 16h: ${halfVolume.value} mL (${next16hRate.value} mL/h)`;
});
</script>

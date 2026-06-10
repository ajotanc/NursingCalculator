<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Reposição de Eletrólitos
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Calculadora para conversão de mEq prescritos para volume de ampola (mL).
    </div>

    <v-row>
      <v-col cols="12" sm="6">
        <v-select v-model="selectedAmpoule" :items="ampoules" label="Eletrólito / Ampola" variant="outlined"
          hide-details="auto" item-title="name" return-object></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <NumericInput v-model.number="prescribedMEq" label="Prescrição (mEq)" variant="outlined" suffix="mEq" min="0"
          hide-details="auto" />
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-row v-if="isValid && selectedAmpoule">
      <v-col cols="12">
        <v-card color="indigo-lighten-4" class="pa-4 text-center rounded" elevation="0">
          <div class="text-subtitle-2 text-indigo-darken-4 text-uppercase">Volume a Aspirar</div>
          <div class="text-h2 font-weight-black text-indigo-darken-4 my-2">
            {{ calculatedVolume }} <span class="text-h5">mL</span>
          </div>
          <div class="text-subtitle-1 text-indigo-darken-4 font-weight-medium">
            (Equivalente a {{ ampolasCount }} ampolas de {{ selectedAmpoule.volume }}mL)
          </div>
        </v-card>
      </v-col>
    </v-row>

    <CalculatorActions @copy="copyToClipboard('ElectrolyteReplacement', copyText)" @reset="resetForm" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import CalculatorActions from "@/components/CalculatorActions.vue";
import NumericInput from "@/components/NumericInput.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";

const { copyToClipboard } = useAppClipboard();

interface Ampoule {
	name: string;
	meqPerMl: number;
	volume: number;
}

const ampoules: Ampoule[] = [
	{
		name: "Cloreto de Potássio (KCl) 19,1% - 10mL",
		meqPerMl: 2.56,
		volume: 10,
	},
	{ name: "Cloreto de Potássio (KCl) 10% - 10mL", meqPerMl: 1.34, volume: 10 },
	{ name: "Cloreto de Sódio (NaCl) 20% - 10mL", meqPerMl: 3.42, volume: 10 },
	{ name: "Cloreto de Sódio (NaCl) 17,5% - 10mL", meqPerMl: 3.0, volume: 10 },
	{ name: "Bicarbonato de Sódio 8,4% - 10mL", meqPerMl: 1.0, volume: 10 },
	{ name: "Sulfato de Magnésio 50% - 10mL", meqPerMl: 4.06, volume: 10 },
	{ name: "Sulfato de Magnésio 10% - 10mL", meqPerMl: 0.81, volume: 10 },
];

const selectedAmpoule = ref<Ampoule | null>(null);
const prescribedMEq = ref<number | null>(null);

const resetForm = (): void => {
	selectedAmpoule.value = null;
	prescribedMEq.value = null;
};

const isValid = computed(() => {
	return (
		selectedAmpoule.value !== null &&
		prescribedMEq.value !== null &&
		prescribedMEq.value > 0
	);
});

const calculatedVolume = computed(() => {
	if (!isValid.value || !selectedAmpoule.value) return 0;
	return ((prescribedMEq.value ?? 0) / selectedAmpoule.value.meqPerMl).toFixed(
		1,
	);
});

const ampolasCount = computed(() => {
	if (!isValid.value || !selectedAmpoule.value) return 0;
	const vol = (prescribedMEq.value ?? 0) / selectedAmpoule.value.meqPerMl;
	return (vol / selectedAmpoule.value.volume).toFixed(1);
});

const copyText = computed(() => {
	return `Reposição de Eletrólitos:\nAmpola: ${selectedAmpoule.value?.name}\nPrescrição: ${prescribedMEq.value} mEq\nVolume a Aspirar: ${calculatedVolume.value} mL`;
});
</script>

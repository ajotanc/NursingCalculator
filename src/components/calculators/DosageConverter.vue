<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Conversor de Dosagem (Regra de Três)
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Converta a prescrição médica para descobrir o volume exato a ser aspirado da ampola/frasco.
    </div>

    <v-row>
      <v-col cols="12" sm="6">
        <NumericInput v-model.number="haveDose" label="Apresentação (Temos)" variant="outlined" suffix="mg" min="0"
          hide-details="auto"></NumericInput>
      </v-col>
      <v-col cols="12" sm="6">
        <NumericInput v-model.number="haveVolume" label="Diluído em (Volume)" variant="outlined" suffix="mL" min="0"
          hide-details="auto"></NumericInput>
      </v-col>
      <v-col cols="12">
        <NumericInput v-model.number="needDose" label="Prescrição (Médico pede)" variant="outlined" suffix="mg" min="0"
          hide-details="auto"></NumericInput>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-card color="primary-lighten-4" class="pa-6 text-center rounded" elevation="0">
      <div class="text-subtitle-2 text-primary-darken-1 text-uppercase">Você deve aspirar</div>
      <div class="text-h2 font-weight-black text-primary-darken-2 my-2">
        {{ resultVolume }}
      </div>
      <div class="text-subtitle-1 text-primary-darken-1">mL</div>
    </v-card>

    <CalculatorActions
      @copy="copyToClipboard('DosageConverter', `Regra de Três:\nPrescrito: ${haveDose || 0}mg -> Diluído em: ${haveVolume || 0}mL\nDose Alvo: ${needDose || 0}mg -> Administrar: ${resultVolume} mL`)"
      @reset="resetForm" />
  </v-container>
</template>

<script setup lang="ts">
import CalculatorActions from "@/components/CalculatorActions.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";

const { copyToClipboard } = useAppClipboard();

import { computed, ref } from "vue";

const haveDose = ref<number | null>(null);
const haveVolume = ref<number | null>(null);
const needDose = ref<number | null>(null);

const resetForm = (): void => {
	haveDose.value = null;
	haveVolume.value = null;
	needDose.value = null;
};

const resultVolume = computed<string>(() => {
	const hd = haveDose.value ?? 0;
	const hv = haveVolume.value ?? 0;
	const nd = needDose.value ?? 0;

	if (hd <= 0 || hv <= 0 || nd <= 0) {
		return "0.0";
	}
	return ((nd * hv) / hd).toFixed(2);
});
</script>

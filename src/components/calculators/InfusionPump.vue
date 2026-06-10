<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Bomba de Infusão Contínua (BIC)
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Preencha os volumes da solução para obter a velocidade em mL/h.
    </div>

    <v-row>
      <v-col cols="12" sm="6">
        <NumericInput v-model.number="ampouleVolume" label="Volume da(s) Ampola(s) (mL)" variant="outlined" suffix="mL"
          min="0" hide-details="auto"></NumericInput>
      </v-col>
      <v-col cols="12" sm="6">
        <NumericInput v-model.number="serumVolume" label="Volume do Soro/Diluente (mL)" variant="outlined" suffix="mL"
          min="0" hide-details="auto"></NumericInput>
      </v-col>
      <v-col cols="12">
        <NumericInput v-model.number="hours" label="Tempo de Infusão (Horas)" variant="outlined" suffix="h" min="0"
          hide-details="auto"></NumericInput>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-card color="primary-lighten-4" class="pa-6 text-center rounded" elevation="0">
      <v-alert v-if="Number(infusionRate) > 999.9" type="warning" variant="tonal"
        class="mb-4 text-start font-weight-bold" icon="mdi-alert">
        Atenção: A vazão excede o limite padrão da maioria das Bombas de Infusão (999.9 mL/h). Confirme a prescrição.
      </v-alert>

      <div class="text-subtitle-2 text-primary-darken-1 text-uppercase">Vazão da Bomba</div>
      <div class="text-h2 font-weight-black text-primary-darken-2 my-2">
        {{ infusionRate }}
      </div>
      <div class="text-subtitle-1 text-primary-darken-1">mL/h</div>
    </v-card>

    <CalculatorActions
      @copy="copyToClipboard('InfusionPump', `Bomba de Infusão Contínua (BIC):\nAmpola: ${ampouleVolume || 0}mL + Soro: ${serumVolume || 0}mL\nTempo: ${hours || 0}h\nVazão: ${infusionRate} mL/h`)"
      @reset="resetForm" />
  </v-container>
</template>

<script setup lang="ts">
import CalculatorActions from "@/components/CalculatorActions.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";

const { copyToClipboard } = useAppClipboard();

import { computed, ref } from "vue";

const ampouleVolume = ref<number | null>(null);
const serumVolume = ref<number | null>(null);
const hours = ref<number | null>(null);

const resetForm = (): void => {
	ampouleVolume.value = null;
	serumVolume.value = null;
	hours.value = null;
};

const infusionRate = computed<string>(() => {
	const v1 = ampouleVolume.value ?? 0;
	const v2 = serumVolume.value ?? 0;
	const totalVolume = v1 + v2;
	const h = hours.value ?? 0;

	if (totalVolume <= 0 || h <= 0) {
		return "0.0";
	}
	return (totalVolume / h).toFixed(1);
});
</script>

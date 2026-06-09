<template>
  <v-container class="pa-6">
    <div class="text-h5 text-teal-darken-2 mb-4 font-weight-bold">
      Escala Móvel de Insulina
    </div>
    <v-alert type="warning" variant="tonal" class="mb-6 text-caption">
      O resultado baseia-se em um protocolo padrão genérico. Verifique a prescrição do seu hospital.
    </v-alert>

    <NumericInput
      v-model.number="hgt"
      label="Glicemia Capilar (HGT)"
     
      variant="outlined"
      suffix="mg/dL"
      min="0"
      hide-details="auto"
      class="mb-6"
    ></NumericInput>

    <v-card color="teal-lighten-4" class="pa-6 text-center rounded-lg" elevation="0">
      <div class="text-subtitle-2 text-teal-darken-3 text-uppercase">Dose Indicada</div>
      <div class="text-h2 font-weight-black text-teal-darken-4 my-2">
        {{ insulinUnits }}
      </div>
      <div class="text-subtitle-1 text-teal-darken-3">Unidades de Insulina Regular</div>
    </v-card>
    <div class="mt-6 text-end">
      <v-btn color="teal-darken-2" variant="tonal" prepend-icon="mdi-clipboard-text" @click="copyToClipboard('InsulinScale', `Escala de Insulina:\nGlicemia: ${hgt || 0} mg/dL\nAdministrar: ${insulinUnits} UI`)">
        Copiar
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useAppClipboard } from "@/composables/useAppClipboard";

const { copyToClipboard } = useAppClipboard();

import { useLocalStorage } from "@vueuse/core";
import { computed, ref } from "vue";

const hgt = useLocalStorage<number | null>("nc-InsulinScale-hgt", null);

const insulinUnits = computed<string>(() => {
	const val = hgt.value ?? 0;
	if (val <= 0) return "-";
	if (val < 150) return "0";
	if (val >= 150 && val <= 200) return "2";
	if (val >= 201 && val <= 250) return "4";
	if (val >= 251 && val <= 300) return "6";
	if (val >= 301 && val <= 350) return "8";
	return "10+ (Notificar MD)";
});
</script>

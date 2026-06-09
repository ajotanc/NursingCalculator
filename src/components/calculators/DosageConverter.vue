<template>
  <v-container class="pa-6">
    <div class="text-h5 text-teal-darken-2 mb-4 font-weight-bold">
      Conversor de Dosagem (Regra de Três)
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Converta a prescrição médica para descobrir o volume exato a ser aspirado da ampola/frasco.
    </div>

    <v-row>
      <v-col cols="12" sm="6">
        <NumericInput
          v-model.number="haveDose"
          label="Apresentação (Temos)"
         
          variant="outlined"
          suffix="mg"
          min="0"
          hide-details="auto"
        ></NumericInput>
      </v-col>
      <v-col cols="12" sm="6">
        <NumericInput
          v-model.number="haveVolume"
          label="Diluído em (Volume)"
         
          variant="outlined"
          suffix="mL"
          min="0"
          hide-details="auto"
        ></NumericInput>
      </v-col>
      <v-col cols="12">
        <NumericInput
          v-model.number="needDose"
          label="Prescrição (Médico pede)"
         
          variant="outlined"
          suffix="mg"
          min="0"
          hide-details="auto"
        ></NumericInput>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-card color="teal-lighten-4" class="pa-6 text-center rounded-lg" elevation="0">
      <div class="text-subtitle-2 text-teal-darken-3 text-uppercase">Você deve aspirar</div>
      <div class="text-h2 font-weight-black text-teal-darken-4 my-2">
        {{ resultVolume }}
      </div>
      <div class="text-subtitle-1 text-teal-darken-3">mL</div>
    </v-card>

    <div class="mt-6 text-end">
      
      <v-btn color="teal-darken-2" variant="tonal" prepend-icon="mdi-clipboard-text" @click="copyToClipboard('DosageConverter', `Regra de Três:\nPrescrito: ${haveDose || 0}mg -> Diluído em: ${haveVolume || 0}mL\nDose Alvo: ${needDose || 0}mg -> Administrar: ${resultVolume} mL`)" class="mr-4">
        Copiar
      </v-btn>
      <v-btn color="grey-darken-1" variant="text" @click="resetForm">
        Limpar Valores
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useAppClipboard } from "@/composables/useAppClipboard";

const { copyToClipboard } = useAppClipboard();

import { useLocalStorage } from "@vueuse/core";
import { computed, ref } from "vue";

const haveDose = useLocalStorage<number | null>(
	"nc-DosageConverter-haveDose",
	null,
);
const haveVolume = useLocalStorage<number | null>(
	"nc-DosageConverter-haveVolume",
	null,
);
const needDose = useLocalStorage<number | null>(
	"nc-DosageConverter-needDose",
	null,
);

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

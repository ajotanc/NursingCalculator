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
        <v-text-field
          v-model.number="haveDose"
          label="Apresentação (Temos)"
          type="number"
          variant="outlined"
          suffix="mg"
          min="0"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.number="haveVolume"
          label="Diluído em (Volume)"
          type="number"
          variant="outlined"
          suffix="mL"
          min="0"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="needDose"
          label="Prescrição (Médico pede)"
          type="number"
          variant="outlined"
          suffix="mg"
          min="0"
          hide-details="auto"
        ></v-text-field>
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
      <v-btn color="grey-darken-1" variant="text" @click="resetForm">
        Limpar Valores
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
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

<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Escala de Coma de Glasgow (ECG)
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Avalie o nível de consciência do paciente selecionando as melhores respostas.
    </div>

    <v-row>
      <v-col cols="12">
        <v-select
          v-model="eyeOpening"
          :items="eyeOptions"
          item-title="title"
          item-value="value"
          label="Abertura Ocular"
          variant="outlined"
          color="primary"
          hide-details="auto"
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="verbalResponse"
          :items="verbalOptions"
          item-title="title"
          item-value="value"
          label="Resposta Verbal"
          variant="outlined"
          color="primary"
          hide-details="auto"
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="motorResponse"
          :items="motorOptions"
          item-title="title"
          item-value="value"
          label="Resposta Motora"
          variant="outlined"
          color="primary"
          hide-details="auto"
        ></v-select>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-card :color="scoreColor" class="pa-6 text-center rounded-lg" elevation="0" variant="tonal">
      <div class="text-subtitle-2 text-uppercase">Pontuação Total</div>
      <div class="text-h2 font-weight-black my-2">
        {{ totalScore }}
      </div>
      <div class="text-subtitle-1 font-weight-bold">{{ classification }}</div>
    </v-card>

    <CalculatorActions @copy="copyToClipboard('GlasgowScale', `Escala de Coma de Glasgow:\nAbertura Ocular: ${eyeOpening || 0}\nResposta Verbal: ${verbalResponse || 0}\nResposta Motora: ${motorResponse || 0}\nTotal: ${totalScore} (${classification})`)" @reset="resetForm" />
  </v-container>
</template>

<script setup lang="ts">
import CalculatorActions from "@/components/CalculatorActions.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";

const { copyToClipboard } = useAppClipboard();

import { computed, ref } from "vue";

const eyeOpening = ref<number | null>(null);
const verbalResponse = ref<number | null>(null);
const motorResponse = ref<number | null>(null);

const eyeOptions = [
	{ title: "Espontânea (4)", value: 4 },
	{ title: "Ao estímulo sonoro (3)", value: 3 },
	{ title: "Ao estímulo de pressão/dor (2)", value: 2 },
	{ title: "Ausente (1)", value: 1 },
];

const verbalOptions = [
	{ title: "Orientada (5)", value: 5 },
	{ title: "Confusa (4)", value: 4 },
	{ title: "Palavras inapropriadas (3)", value: 3 },
	{ title: "Sons incompreensíveis (2)", value: 2 },
	{ title: "Ausente (1)", value: 1 },
];

const motorOptions = [
	{ title: "Obedece a comandos (6)", value: 6 },
	{ title: "Localiza estímulo (5)", value: 5 },
	{ title: "Retirada normal/flexão (4)", value: 4 },
	{ title: "Flexão anormal/decorticação (3)", value: 3 },
	{ title: "Extensão anormal/descerebração (2)", value: 2 },
	{ title: "Ausente (1)", value: 1 },
];

const resetForm = (): void => {
	eyeOpening.value = null;
	verbalResponse.value = null;
	motorResponse.value = null;
};

const totalScore = computed<string | number>(() => {
	if (!eyeOpening.value || !verbalResponse.value || !motorResponse.value)
		return "-";
	return eyeOpening.value + verbalResponse.value + motorResponse.value;
});

const scoreColor = computed<string>(() => {
	const score = Number(totalScore.value);
	if (Number.isNaN(score)) return "grey";
	if (score >= 13) return "success";
	if (score >= 9) return "warning";
	return "error";
});

const classification = computed<string>(() => {
	const score = Number(totalScore.value);
	if (Number.isNaN(score)) return "Aguardando preenchimento";
	if (score >= 13) return "Trauma Leve";
	if (score >= 9) return "Trauma Moderado";
	return "Trauma Grave (Indicação de IOT)";
});
</script>

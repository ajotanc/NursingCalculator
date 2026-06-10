<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Índice de APGAR
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Avaliação da vitalidade do recém-nascido (1º e 5º minuto de vida).
    </div>

    <v-row>
      <v-col cols="12" sm="6">
        <v-select
          v-model="heartRate"
          :items="hrOptions"
          label="Frequência Cardíaca"
          variant="outlined"
          hide-details="auto"
          item-title="title"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="respiration"
          :items="respOptions"
          label="Esforço Respiratório"
          variant="outlined"
          hide-details="auto"
          item-title="title"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="muscleTone"
          :items="toneOptions"
          label="Tônus Muscular"
          variant="outlined"
          hide-details="auto"
          item-title="title"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="reflex"
          :items="reflexOptions"
          label="Irritabilidade Reflexa"
          variant="outlined"
          hide-details="auto"
          item-title="title"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="color"
          :items="colorOptions"
          label="Cor da Pele"
          variant="outlined"
          hide-details="auto"
          item-title="title"
          item-value="value"
        ></v-select>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-row v-if="isValid">
      <v-col cols="12">
        <v-card :color="apgarColor + '-lighten-4'" class="pa-4 text-center rounded-lg" elevation="0">
          <div :class="`text-subtitle-2 text-${apgarColor}-darken-2 text-uppercase`">Escore APGAR</div>
          <div :class="`text-h2 font-weight-black text-${apgarColor}-darken-3 my-2`">
            {{ totalScore }}
          </div>
          <div :class="`text-subtitle-1 font-weight-bold text-${apgarColor}-darken-2`">
            {{ apgarClassification }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <CalculatorActions @copy="copyToClipboard('ApgarScore', copyText)" @reset="resetForm" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import CalculatorActions from "@/components/CalculatorActions.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";

const { copyToClipboard } = useAppClipboard();

const heartRate = ref<number | null>(null);
const respiration = ref<number | null>(null);
const muscleTone = ref<number | null>(null);
const reflex = ref<number | null>(null);
const color = ref<number | null>(null);

const hrOptions = [
	{ title: "Ausente (0)", value: 0 },
	{ title: "< 100 bpm (1)", value: 1 },
	{ title: "> 100 bpm (2)", value: 2 },
];

const respOptions = [
	{ title: "Ausente (0)", value: 0 },
	{ title: "Lento, Irregular (1)", value: 1 },
	{ title: "Bom, Choro Forte (2)", value: 2 },
];

const toneOptions = [
	{ title: "Flácido (0)", value: 0 },
	{ title: "Alguma Flexão (1)", value: 1 },
	{ title: "Movimento Ativo (2)", value: 2 },
];

const reflexOptions = [
	{ title: "Sem Resposta (0)", value: 0 },
	{ title: "Careta (1)", value: 1 },
	{ title: "Choro / Tosse / Espirro (2)", value: 2 },
];

const colorOptions = [
	{ title: "Cianose Central ou Palidez (0)", value: 0 },
	{ title: "Corpo Róseo, Extremidades Cianóticas (Acrocianose) (1)", value: 1 },
	{ title: "Totalmente Róseo (2)", value: 2 },
];

const resetForm = (): void => {
	heartRate.value = null;
	respiration.value = null;
	muscleTone.value = null;
	reflex.value = null;
	color.value = null;
};

const isValid = computed(() => {
	return (
		heartRate.value !== null &&
		respiration.value !== null &&
		muscleTone.value !== null &&
		reflex.value !== null &&
		color.value !== null
	);
});

const totalScore = computed(() => {
	if (!isValid.value) return 0;
	return (
		(heartRate.value ?? 0) +
		(respiration.value ?? 0) +
		(muscleTone.value ?? 0) +
		(reflex.value ?? 0) +
		(color.value ?? 0)
	);
});

const apgarClassification = computed(() => {
	if (totalScore.value >= 7) return "Boa Vitalidade / Sem Asfixia";
	if (totalScore.value >= 4) return "Asfixia Moderada (Necessita manobras)";
	return "Asfixia Grave (Reanimação Neonatal)";
});

const apgarColor = computed(() => {
	if (totalScore.value >= 7) return "green";
	if (totalScore.value >= 4) return "orange";
	return "red";
});

const copyText = computed(() => {
	return `Índice de APGAR:\nEscore: ${totalScore.value} pontos\nDiagnóstico: ${apgarClassification.value}`;
});
</script>

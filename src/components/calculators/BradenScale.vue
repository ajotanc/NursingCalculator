<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Escala de Braden
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Avalie o risco de desenvolvimento de Lesão por Pressão (LPP).
    </div>

    <v-row>
      <v-col cols="12" sm="6">
        <v-select
          v-model="sensory"
          :items="sensoryOptions"
          label="Percepção Sensorial"
          variant="outlined"
          hide-details="auto"
          item-title="title"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="moisture"
          :items="moistureOptions"
          label="Umidade"
          variant="outlined"
          hide-details="auto"
          item-title="title"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="activity"
          :items="activityOptions"
          label="Atividade"
          variant="outlined"
          hide-details="auto"
          item-title="title"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="mobility"
          :items="mobilityOptions"
          label="Mobilidade"
          variant="outlined"
          hide-details="auto"
          item-title="title"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="nutrition"
          :items="nutritionOptions"
          label="Nutrição"
          variant="outlined"
          hide-details="auto"
          item-title="title"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="friction"
          :items="frictionOptions"
          label="Fricção e Cisalhamento"
          variant="outlined"
          hide-details="auto"
          item-title="title"
          item-value="value"
        ></v-select>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-row v-if="totalScore > 0">
      <v-col cols="12">
        <v-card :color="riskColor + '-lighten-4'" class="pa-4 text-center rounded-lg" elevation="0">
          <div :class="`text-subtitle-2 text-${riskColor}-darken-2 text-uppercase`">Risco de LPP</div>
          <div :class="`text-h4 font-weight-black text-${riskColor}-darken-3 my-2`">
            {{ riskClassification }}
          </div>
          <div :class="`text-subtitle-1 text-${riskColor}-darken-2`">Escore: {{ totalScore }} pontos</div>
        </v-card>
      </v-col>
    </v-row>

    <CalculatorActions @copy="copyToClipboard('BradenScale', copyText)" @reset="resetForm" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import CalculatorActions from "@/components/CalculatorActions.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";

const { copyToClipboard } = useAppClipboard();

const sensory = ref<number>(0);
const moisture = ref<number>(0);
const activity = ref<number>(0);
const mobility = ref<number>(0);
const nutrition = ref<number>(0);
const friction = ref<number>(0);

const sensoryOptions = [
	{ title: "1. Totalmente Limitado", value: 1 },
	{ title: "2. Muito Limitado", value: 2 },
	{ title: "3. Levemente Limitado", value: 3 },
	{ title: "4. Nenhuma Limitação", value: 4 },
];

const moistureOptions = [
	{ title: "1. Constantemente Úmido", value: 1 },
	{ title: "2. Muito Úmido", value: 2 },
	{ title: "3. Ocasionalmente Úmido", value: 3 },
	{ title: "4. Raramente Úmido", value: 4 },
];

const activityOptions = [
	{ title: "1. Acamado", value: 1 },
	{ title: "2. Confinado à Cadeira", value: 2 },
	{ title: "3. Caminha Ocasionalmente", value: 3 },
	{ title: "4. Caminha Frequentemente", value: 4 },
];

const mobilityOptions = [
	{ title: "1. Totalmente Imóvel", value: 1 },
	{ title: "2. Bastante Limitado", value: 2 },
	{ title: "3. Levemente Limitado", value: 3 },
	{ title: "4. Sem Limitação", value: 4 },
];

const nutritionOptions = [
	{ title: "1. Muito Pobre", value: 1 },
	{ title: "2. Provavelmente Inadequada", value: 2 },
	{ title: "3. Adequada", value: 3 },
	{ title: "4. Excelente", value: 4 },
];

const frictionOptions = [
	{ title: "1. Problema", value: 1 },
	{ title: "2. Problema Potencial", value: 2 },
	{ title: "3. Nenhum Problema Aparente", value: 3 },
];

const resetForm = (): void => {
	sensory.value = 0;
	moisture.value = 0;
	activity.value = 0;
	mobility.value = 0;
	nutrition.value = 0;
	friction.value = 0;
};

const totalScore = computed(() => {
	return (
		sensory.value +
		moisture.value +
		activity.value +
		mobility.value +
		nutrition.value +
		friction.value
	);
});

const riskClassification = computed(() => {
	if (totalScore.value === 0) return "-";
	if (totalScore.value <= 9) return "Risco Muito Alto";
	if (totalScore.value <= 12) return "Risco Alto";
	if (totalScore.value <= 14) return "Risco Moderado";
	if (totalScore.value <= 18) return "Risco Baixo";
	return "Sem Risco / Risco Brando";
});

const riskColor = computed(() => {
	if (totalScore.value === 0) return "grey";
	if (totalScore.value <= 9) return "red";
	if (totalScore.value <= 12) return "deep-orange";
	if (totalScore.value <= 14) return "orange";
	if (totalScore.value <= 18) return "amber";
	return "green";
});

const copyText = computed(() => {
	return `Escala de Braden:\nEscore Total: ${totalScore.value} pontos\nClassificação: ${riskClassification.value}`;
});
</script>

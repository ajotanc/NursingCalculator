<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Escala MEWS
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Modified Early Warning Score. Rastreio de deterioração clínica e alerta precoce.
    </div>

    <v-row>
      <v-col cols="12" sm="6">
        <v-select
          v-model="respiratoryRate"
          :items="rrOptions"
          label="Frequência Respiratória (irpm)"
          variant="outlined"
          hide-details="auto"
          item-title="title"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="heartRate"
          :items="hrOptions"
          label="Frequência Cardíaca (bpm)"
          variant="outlined"
          hide-details="auto"
          item-title="title"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="systolicBP"
          :items="sbpOptions"
          label="Pressão Sistólica (mmHg)"
          variant="outlined"
          hide-details="auto"
          item-title="title"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="temperature"
          :items="tempOptions"
          label="Temperatura (°C)"
          variant="outlined"
          hide-details="auto"
          item-title="title"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="avpu"
          :items="avpuOptions"
          label="Nível de Consciência (AVPU)"
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
        <v-card :color="riskColor + '-lighten-4'" class="pa-4 text-center rounded-lg" elevation="0">
          <div :class="`text-subtitle-2 text-${riskColor}-darken-2 text-uppercase`">MEWS Score</div>
          <div :class="`text-h3 font-weight-black text-${riskColor}-darken-3 my-2`">
            {{ totalScore }} pontos
          </div>
          <div :class="`text-subtitle-1 font-weight-bold text-${riskColor}-darken-2`">
            {{ riskClassification }}
          </div>
          <div :class="`text-body-2 mt-2 text-${riskColor}-darken-2`">
            {{ riskAction }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <CalculatorActions @copy="copyToClipboard('EarlyWarningScale', copyText)" @reset="resetForm" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import CalculatorActions from "@/components/CalculatorActions.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";

const { copyToClipboard } = useAppClipboard();

const respiratoryRate = ref<number | null>(null);
const heartRate = ref<number | null>(null);
const systolicBP = ref<number | null>(null);
const temperature = ref<number | null>(null);
const avpu = ref<number | null>(null);

const rrOptions = [
	{ title: "< 9 (2 pontos)", value: 2 },
	{ title: "9 a 14 (0 pontos)", value: 0 },
	{ title: "15 a 20 (1 ponto)", value: 1 },
	{ title: "21 a 29 (2 pontos)", value: 2 },
	{ title: "≥ 30 (3 pontos)", value: 3 },
];

const hrOptions = [
	{ title: "< 40 (2 pontos)", value: 2 },
	{ title: "40 a 50 (1 ponto)", value: 1 },
	{ title: "51 a 100 (0 pontos)", value: 0 },
	{ title: "101 a 110 (1 ponto)", value: 1 },
	{ title: "111 a 129 (2 pontos)", value: 2 },
	{ title: "≥ 130 (3 pontos)", value: 3 },
];

const sbpOptions = [
	{ title: "< 70 (3 pontos)", value: 3 },
	{ title: "71 a 80 (2 pontos)", value: 2 },
	{ title: "81 a 100 (1 ponto)", value: 1 },
	{ title: "101 a 199 (0 pontos)", value: 0 },
	{ title: "≥ 200 (2 pontos)", value: 2 },
];

const tempOptions = [
	{ title: "< 35.0 (2 pontos)", value: 2 },
	{ title: "35.0 a 38.4 (0 pontos)", value: 0 },
	{ title: "≥ 38.5 (2 pontos)", value: 2 },
];

const avpuOptions = [
	{ title: "A - Alerta / Orientado (0 pontos)", value: 0 },
	{ title: "V - Reage à Voz / Confuso (1 ponto)", value: 1 },
	{ title: "P - Reage à Dor (2 pontos)", value: 2 },
	{ title: "U - Irresponsivo (3 pontos)", value: 3 },
];

const resetForm = (): void => {
	respiratoryRate.value = null;
	heartRate.value = null;
	systolicBP.value = null;
	temperature.value = null;
	avpu.value = null;
};

const isValid = computed(() => {
	return (
		respiratoryRate.value !== null &&
		heartRate.value !== null &&
		systolicBP.value !== null &&
		temperature.value !== null &&
		avpu.value !== null
	);
});

const totalScore = computed(() => {
	if (!isValid.value) return 0;
	return (
		(respiratoryRate.value ?? 0) +
		(heartRate.value ?? 0) +
		(systolicBP.value ?? 0) +
		(temperature.value ?? 0) +
		(avpu.value ?? 0)
	);
});

const riskClassification = computed(() => {
	if (totalScore.value >= 5 || avpu.value === 3)
		return "Risco Alto (Deterioração Grave)";
	if (totalScore.value >= 3) return "Risco Moderado";
	return "Risco Baixo";
});

const riskAction = computed(() => {
	if (totalScore.value >= 5 || avpu.value === 3)
		return "ACIONAR TIME DE RESPOSTA RÁPIDA (MÉDICO IMEDIATO). Monitorização contínua.";
	if (totalScore.value >= 3)
		return "Avaliação médica em até 30 minutos. Aumentar frequência de sinais vitais para cada 2h.";
	return "Manter rotina de sinais vitais (4/4h ou 6/6h) e observação da enfermagem.";
});

const riskColor = computed(() => {
	if (totalScore.value >= 5 || avpu.value === 3) return "red";
	if (totalScore.value >= 3) return "orange";
	return "green";
});

const copyText = computed(() => {
	return `Escala MEWS:\nScore Total: ${totalScore.value} pontos\nClassificação: ${riskClassification.value}\nConduta: ${riskAction.value}`;
});
</script>

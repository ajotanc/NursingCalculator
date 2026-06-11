<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Escala de Morse
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Avalie o risco de quedas do paciente.
    </div>

    <v-row>
      <v-col cols="12" sm="6">
        <v-select v-model="history" :items="historyOptions" label="Histórico de Quedas (últimos 3 meses)"
          variant="outlined" hide-details="auto" item-title="title" item-value="value"></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select v-model="secondaryDiagnosis" :items="yesNoOptions(15)" label="Diagnóstico Secundário (>1 diagnóstico)"
          variant="outlined" hide-details="auto" item-title="title" item-value="value"></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select v-model="ambulation" :items="ambulationOptions" label="Auxílio na Deambulação" variant="outlined"
          hide-details="auto" item-title="title" item-value="value"></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select v-model="ivTherapy" :items="yesNoOptions(20)" label="Terapia Endovenosa / Acesso Salinizado"
          variant="outlined" hide-details="auto" item-title="title" item-value="value"></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select v-model="gait" :items="gaitOptions" label="Marcha" variant="outlined" hide-details="auto"
          item-title="title" item-value="value"></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select v-model="mentalStatus" :items="mentalOptions" label="Estado Mental" variant="outlined"
          hide-details="auto" item-title="title" item-value="value"></v-select>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-row v-if="history !== null">
      <v-col cols="12">
        <v-card :color="riskColor + '-lighten-4'" class="pa-4 text-center rounded">
          <div :class="`text-subtitle-2 text-${riskColor}-darken-2 text-uppercase`">Risco de Queda</div>
          <div :class="`text-h4 font-weight-black text-${riskColor}-darken-3 my-2`">
            {{ riskClassification }}
          </div>
          <div :class="`text-subtitle-1 text-${riskColor}-darken-2`">Escore: {{ totalScore }} pontos</div>
        </v-card>
      </v-col>
    </v-row>

    <CalculatorActions @copy="copyToClipboard('MorseScale', copyText)" @reset="resetForm" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import CalculatorActions from "@/components/CalculatorActions.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";

const { copyToClipboard } = useAppClipboard();

const history = ref<number | null>(null);
const secondaryDiagnosis = ref<number | null>(null);
const ambulation = ref<number | null>(null);
const ivTherapy = ref<number | null>(null);
const gait = ref<number | null>(null);
const mentalStatus = ref<number | null>(null);

const yesNoOptions = (yesValue: number) => [
	{ title: "Não", value: 0 },
	{ title: "Sim", value: yesValue },
];

const historyOptions = yesNoOptions(25);

const ambulationOptions = [
	{ title: "Nenhum / Acamado / Auxílio de Profissional", value: 0 },
	{ title: "Muletas / Bengala / Andador", value: 15 },
	{ title: "Apoia-se em Móveis", value: 30 },
];

const gaitOptions = [
	{ title: "Normal / Acamado / Cadeira de Rodas", value: 0 },
	{ title: "Fraca (Passos curtos, arrasta pés)", value: 10 },
	{ title: "Comprometida / Cambaleante", value: 20 },
];

const mentalOptions = [
	{ title: "Orientado / Capaz / Reconhece Limitações", value: 0 },
	{ title: "Superestima Capacidade / Esquece Limitações", value: 15 },
];

const resetForm = (): void => {
	history.value = null;
	secondaryDiagnosis.value = null;
	ambulation.value = null;
	ivTherapy.value = null;
	gait.value = null;
	mentalStatus.value = null;
};

const totalScore = computed(() => {
	return (
		(history.value || 0) +
		(secondaryDiagnosis.value || 0) +
		(ambulation.value || 0) +
		(ivTherapy.value || 0) +
		(gait.value || 0) +
		(mentalStatus.value || 0)
	);
});

const riskClassification = computed(() => {
	if (history.value === null) return "-";
	if (totalScore.value >= 45) return "Risco Alto";
	if (totalScore.value >= 25) return "Risco Moderado";
	return "Risco Baixo / Sem Risco";
});

const riskColor = computed(() => {
	if (history.value === null) return "grey";
	if (totalScore.value >= 45) return "red";
	if (totalScore.value >= 25) return "orange";
	return "green";
});

const copyText = computed(() => {
	return `Escala de Morse:\nEscore Total: ${totalScore.value} pontos\nClassificação: ${riskClassification.value}`;
});
</script>

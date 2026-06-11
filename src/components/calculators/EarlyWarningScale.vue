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
				<v-select v-model="respiratoryRate" :items="rrOptions" label="Frequência Respiratória (irpm)" variant="outlined"
					hide-details="auto" item-title="title" item-value="id"></v-select>
			</v-col>
			<v-col cols="12" sm="6">
				<v-select v-model="heartRate" :items="hrOptions" label="Frequência Cardíaca (bpm)" variant="outlined"
					hide-details="auto" item-title="title" item-value="id"></v-select>
			</v-col>
			<v-col cols="12" sm="6">
				<v-select v-model="systolicBP" :items="sbpOptions" label="Pressão Sistólica (mmHg)" variant="outlined"
					hide-details="auto" item-title="title" item-value="id"></v-select>
			</v-col>
			<v-col cols="12" sm="6">
				<v-select v-model="temperature" :items="tempOptions" label="Temperatura (°C)" variant="outlined"
					hide-details="auto" item-title="title" item-value="id"></v-select>
			</v-col>
			<v-col cols="12">
				<v-select v-model="avpu" :items="avpuOptions" label="Nível de Consciência (AVPU)" variant="outlined"
					hide-details="auto" item-title="title" item-value="id"></v-select>
			</v-col>
		</v-row>

		<v-divider class="my-6"></v-divider>

		<v-row v-if="isValid">
			<v-col cols="12">
				<v-card :color="riskColor + '-lighten-4'" class="pa-4 text-center rounded">
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
import { computed, onMounted, ref, watch } from "vue";
import CalculatorActions from "@/components/CalculatorActions.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";
import { usePatient } from "@/composables/usePatient";

const { copyToClipboard } = useAppClipboard();
const { currentPatient, getPatientParam } = usePatient();

const respiratoryRate = ref<string | null>(null);
const heartRate = ref<string | null>(null);
const systolicBP = ref<string | null>(null);
const temperature = ref<string | null>(null);
const avpu = ref<string | null>(null);

const getRRId = (rr?: number | null): string | null => {
	if (!rr) return null;
	if (rr < 9) return "rr1";
	if (rr <= 14) return "rr2";
	if (rr <= 20) return "rr3";
	if (rr <= 29) return "rr4";
	return "rr5";
};

const getHRId = (hr?: number | null): string | null => {
	if (!hr) return null;
	if (hr < 40) return "hr1";
	if (hr <= 50) return "hr2";
	if (hr <= 100) return "hr3";
	if (hr <= 110) return "hr4";
	if (hr <= 129) return "hr5";
	return "hr6";
};

const getSBPId = (pa?: string | null | undefined): string | null => {
	if (!pa) return null;
	const match = pa.match(/^(\d+)/);
	if (!match) return null;
	const sbp = parseInt(match[1], 10);
	if (sbp < 70) return "sbp1";
	if (sbp <= 80) return "sbp2";
	if (sbp <= 100) return "sbp3";
	if (sbp <= 199) return "sbp4";
	return "sbp5";
};

const getTempId = (temp?: number | null): string | null => {
	if (!temp) return null;
	if (temp < 35.0) return "t1";
	if (temp <= 38.4) return "t2";
	return "t3";
};

const populateFromPatient = () => {
	respiratoryRate.value = getRRId(currentPatient.value.fr);
	heartRate.value = getHRId(currentPatient.value.fc);
	systolicBP.value = getSBPId(currentPatient.value.pa);
	temperature.value = getTempId(currentPatient.value.temp);
};

onMounted(() => {
	populateFromPatient();
});

watch(
	() => currentPatient.value,
	() => {
		populateFromPatient();
	},
	{ deep: true },
);

const rrOptions = [
	{ id: "rr1", title: "< 9 (2 pontos)", value: 2 },
	{ id: "rr2", title: "9 a 14 (0 pontos)", value: 0 },
	{ id: "rr3", title: "15 a 20 (1 ponto)", value: 1 },
	{ id: "rr4", title: "21 a 29 (2 pontos)", value: 2 },
	{ id: "rr5", title: "≥ 30 (3 pontos)", value: 3 },
];

const hrOptions = [
	{ id: "hr1", title: "< 40 (2 pontos)", value: 2 },
	{ id: "hr2", title: "40 a 50 (1 ponto)", value: 1 },
	{ id: "hr3", title: "51 a 100 (0 pontos)", value: 0 },
	{ id: "hr4", title: "101 a 110 (1 ponto)", value: 1 },
	{ id: "hr5", title: "111 a 129 (2 pontos)", value: 2 },
	{ id: "hr6", title: "≥ 130 (3 pontos)", value: 3 },
];

const sbpOptions = [
	{ id: "sbp1", title: "< 70 (3 pontos)", value: 3 },
	{ id: "sbp2", title: "71 a 80 (2 pontos)", value: 2 },
	{ id: "sbp3", title: "81 a 100 (1 ponto)", value: 1 },
	{ id: "sbp4", title: "101 a 199 (0 pontos)", value: 0 },
	{ id: "sbp5", title: "≥ 200 (2 pontos)", value: 2 },
];

const tempOptions = [
	{ id: "t1", title: "< 35.0 (2 pontos)", value: 2 },
	{ id: "t2", title: "35.0 a 38.4 (0 pontos)", value: 0 },
	{ id: "t3", title: "≥ 38.5 (2 pontos)", value: 2 },
];

const avpuOptions = [
	{ id: "a1", title: "A - Alerta / Orientado (0 pontos)", value: 0 },
	{ id: "a2", title: "V - Reage à Voz / Confuso (1 ponto)", value: 1 },
	{ id: "a3", title: "P - Reage à Dor (2 pontos)", value: 2 },
	{ id: "a4", title: "U - Irresponsivo (3 pontos)", value: 3 },
];

const resetForm = (): void => {
	respiratoryRate.value = null;
	heartRate.value = null;
	systolicBP.value = null;
	temperature.value = null;
	avpu.value = null;
	populateFromPatient();
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

const avpuValue = computed(
	() => avpuOptions.find((o) => o.id === avpu.value)?.value ?? 0,
);

const totalScore = computed(() => {
	if (!isValid.value) return 0;

	const rrVal =
		rrOptions.find((o) => o.id === respiratoryRate.value)?.value ?? 0;
	const hrVal = hrOptions.find((o) => o.id === heartRate.value)?.value ?? 0;
	const sbpVal = sbpOptions.find((o) => o.id === systolicBP.value)?.value ?? 0;
	const tempVal =
		tempOptions.find((o) => o.id === temperature.value)?.value ?? 0;

	return rrVal + hrVal + sbpVal + tempVal + avpuValue.value;
});

const riskClassification = computed(() => {
	if (totalScore.value >= 5 || avpuValue.value === 3)
		return "Risco Alto (Deterioração Grave)";
	if (totalScore.value >= 3) return "Risco Moderado";
	return "Risco Baixo";
});

const riskAction = computed(() => {
	if (totalScore.value >= 5 || avpuValue.value === 3)
		return "ACIONAR TIME DE RESPOSTA RÁPIDA (MÉDICO IMEDIATO). Monitorização contínua.";
	if (totalScore.value >= 3)
		return "Avaliação médica em até 30 minutos. Aumentar frequência de sinais vitais para cada 2h.";
	return "Manter rotina de sinais vitais (4/4h ou 6/6h) e observação da enfermagem.";
});

const riskColor = computed(() => {
	if (totalScore.value >= 5 || avpuValue.value === 3) return "red";
	if (totalScore.value >= 3) return "orange";
	return "green";
});

const copyText = computed(() => {
	return `Escala MEWS:\nScore Total: ${totalScore.value} pontos\nClassificação: ${riskClassification.value}\nConduta: ${riskAction.value}`;
});
</script>

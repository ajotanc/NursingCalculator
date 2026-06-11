<template>
	<v-container class="pa-6">
		<div class="text-h5 text-primary mb-4 font-weight-bold">
			Compatibilidade em Y
		</div>
		<div class="text-subtitle-1 text-grey-darken-1 mb-6">
			Verifique rapidamente a compatibilidade intravenosa de medicações comuns em UTI na mesma via (Sítio em Y).
		</div>

		<v-row class="mb-4 shrink-0">
			<v-col cols="12" sm="6">
				<v-autocomplete v-model="drug1" :items="drugNames" label="Medicação 1" variant="outlined" density="comfortable"
					prepend-inner-icon="mdi-pill" clearable hide-details></v-autocomplete>
			</v-col>
			<v-col cols="12" sm="6">
				<v-autocomplete v-model="drug2" :items="drugNames" label="Medicação 2" variant="outlined" density="comfortable"
					prepend-inner-icon="mdi-needle" clearable hide-details></v-autocomplete>
			</v-col>
		</v-row>

		<v-row class="grow" v-if="drug1 && drug2 && drug1 !== drug2">
			<v-col cols="12" class="d-flex align-start justify-center">
				<v-card class="pa-6 w-100 text-center rounded" :color="resultColor" variant="tonal">
					<v-icon :icon="resultIcon" size="64" class="mb-4"></v-icon>
					<div class="text-h4 font-weight-bold mb-2">{{ resultText }}</div>
					<div class="text-body-1">{{ resultSubText }}</div>
				</v-card>
			</v-col>
		</v-row>
		<v-row class="grow" v-else-if="drug1 === drug2 && drug1">
			<v-col cols="12" class="d-flex align-start justify-center">
				<v-card class="pa-6 w-100 text-center rounded" color="grey" variant="tonal">
					<v-icon icon="mdi-information-outline" size="64" class="mb-4"></v-icon>
					<div class="text-h5 font-weight-bold mb-2">Mesma Medicação</div>
				</v-card>
			</v-col>
		</v-row>
		<v-row v-else>
			<v-col cols="12" class="text-center text-grey mt-6">
				<v-icon icon="mdi-flask-outline" size="48" class="mb-2"></v-icon>
				<p>Selecione duas medicações para verificar a compatibilidade.</p>
			</v-col>
		</v-row>

		<v-row class="mt-8 shrink-0">
			<v-col cols="12">
				<v-alert type="warning" variant="tonal" class="text-caption">
					<strong>Aviso:</strong> Esta tabela é um guia de referência rápida baseado no Micromedex e manuais de
					compatibilidade padrão (Trissel). Em caso de dúvida ou misturas complexas, sempre consulte o Farmacêutico
					Clínico.
				</v-alert>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const drug1 = ref<string | null>(null);
const drug2 = ref<string | null>(null);

// Simplificado para demonstração. O ideal seria uma matriz completa.
type Compatibility = "C" | "I" | "?" | "W"; // C = Compatible, I = Incompatible, ? = No Data, W = Caution/Variable

const compatibilityMatrix: Record<string, Record<string, Compatibility>> = {
	Amiodarona: {
		Amiodarona: "C",
		"Bicarbonato de Sódio": "I",
		Dobutamina: "C",
		Dopamina: "C",
		Fentanil: "C",
		Heparina: "I",
		Noradrenalina: "C",
		Propofol: "W",
	},
	"Bicarbonato de Sódio": {
		Amiodarona: "I",
		"Bicarbonato de Sódio": "C",
		Dobutamina: "I",
		Dopamina: "I",
		Fentanil: "I",
		Heparina: "C",
		Noradrenalina: "I",
		Propofol: "I",
	},
	Dobutamina: {
		Amiodarona: "C",
		"Bicarbonato de Sódio": "I",
		Dobutamina: "C",
		Dopamina: "C",
		Fentanil: "C",
		Heparina: "C",
		Noradrenalina: "C",
		Propofol: "C",
	},
	Dopamina: {
		Amiodarona: "C",
		"Bicarbonato de Sódio": "I",
		Dobutamina: "C",
		Dopamina: "C",
		Fentanil: "C",
		Heparina: "C",
		Noradrenalina: "C",
		Propofol: "C",
	},
	Fentanil: {
		Amiodarona: "C",
		"Bicarbonato de Sódio": "I",
		Dobutamina: "C",
		Dopamina: "C",
		Fentanil: "C",
		Heparina: "C",
		Noradrenalina: "C",
		Propofol: "C",
	},
	Heparina: {
		Amiodarona: "I",
		"Bicarbonato de Sódio": "C",
		Dobutamina: "C",
		Dopamina: "C",
		Fentanil: "C",
		Heparina: "C",
		Noradrenalina: "C",
		Propofol: "W",
	},
	Noradrenalina: {
		Amiodarona: "C",
		"Bicarbonato de Sódio": "I",
		Dobutamina: "C",
		Dopamina: "C",
		Fentanil: "C",
		Heparina: "C",
		Noradrenalina: "C",
		Propofol: "C",
	},
	Propofol: {
		Amiodarona: "W",
		"Bicarbonato de Sódio": "I",
		Dobutamina: "C",
		Dopamina: "C",
		Fentanil: "C",
		Heparina: "W",
		Noradrenalina: "C",
		Propofol: "C",
	},
};

const drugNames = Object.keys(compatibilityMatrix).sort();

const currentResult = computed<Compatibility>(() => {
	if (!drug1.value || !drug2.value) return "?";
	const val = compatibilityMatrix[drug1.value]?.[drug2.value];
	return val || "?";
});

const resultColor = computed(() => {
	switch (currentResult.value) {
		case "C":
			return "success";
		case "I":
			return "error";
		case "W":
			return "warning";
		default:
			return "grey";
	}
});

const resultIcon = computed(() => {
	switch (currentResult.value) {
		case "C":
			return "mdi-check-circle-outline";
		case "I":
			return "mdi-close-circle-outline";
		case "W":
			return "mdi-alert-circle-outline";
		default:
			return "mdi-help-circle-outline";
	}
});

const resultText = computed(() => {
	switch (currentResult.value) {
		case "C":
			return "Compatível";
		case "I":
			return "Incompatível";
		case "W":
			return "Atenção Variável";
		default:
			return "Sem Dados";
	}
});

const resultSubText = computed(() => {
	switch (currentResult.value) {
		case "C":
			return "Podem ser administradas juntas na mesma via.";
		case "I":
			return "Risco de precipitação ou inativação. Use vias separadas.";
		case "W":
			return "A compatibilidade depende da concentração ou solução-base.";
		default:
			return "Não há dados suficientes confirmando a segurança.";
	}
});
</script>

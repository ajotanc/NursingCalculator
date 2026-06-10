<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Calculadora de Déficit de Água Livre
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Utilizada em pacientes com Hipernatremia grave para calcular o volume de água livre (geralmente via Soro Glicosado
      5% ou água via SNE) necessário para normalizar o Sódio sérico.
    </div>

    <v-form @submit.prevent>
      <v-row>
        <v-col cols="12">
          <v-select v-model="gender" :items="['Masculino', 'Feminino']" label="Sexo" variant="outlined" color="primary"
            hide-details="auto"></v-select>
        </v-col>
        <v-col cols="12">
          <NumericInput v-model.number="age" label="Idade" suffix="anos" variant="outlined" color="primary"
            hide-details="auto" />
        </v-col>
        <v-col cols="12">
          <NumericInput v-model.number="weight" label="Peso" suffix="kg" variant="outlined" color="primary"
            hide-details="auto" />
        </v-col>
        <v-col cols="12">
          <NumericInput v-model.number="currentNa" label="Sódio Atual" suffix="mEq/L" variant="outlined" color="primary"
            hide-details="auto" />
        </v-col>
        <v-col cols="12">
          <NumericInput v-model.number="targetNa" label="Sódio Alvo" suffix="mEq/L" variant="outlined" color="primary"
            hide-details="auto" />
        </v-col>
      </v-row>
    </v-form>

    <v-card v-if="deficit !== null" class="mt-4" color="primary" variant="tonal">
      <v-card-title class="text-center pb-0">Déficit de Água Livre</v-card-title>
      <v-card-text class="text-center pt-2">
        <div class="text-h4 font-weight-bold mb-2">{{ deficit.toFixed(1) }} Litros</div>
        <p class="text-body-2 mb-0">Água Corporal Total estimada: {{ tbw?.toFixed(1) }}L</p>
      </v-card-text>
      <v-card-actions class="justify-center pt-0 pb-3">
        <v-btn variant="elevated" color="primary" @click="copyToClipboard">Copiar Resultado</v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-if="deficit !== null" variant="tonal" color="warning" class="mt-4 pa-2">
      <h4 class="text-subtitle-2 font-weight-bold mb-1"><v-icon icon="mdi-alert" class="mr-1"></v-icon> Atenção</h4>
      <p class="text-body-2 mb-0">A reposição não deve ser rápida. Recomenda-se reduzir o sódio plasmático em no máximo
        10 a 12 mEq/L a cada 24 horas para evitar o risco de edema cerebral.</p>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { useAppClipboard } from "@/composables/useAppClipboard";
import { usePatient } from "@/composables/usePatient";
import NumericInput from "../NumericInput.vue";

const { copyRawText } = useAppClipboard();
const { currentPatient } = usePatient();

const gender = ref("Masculino");
const age = ref<number | null>(null);
const weight = ref<number | null>(null);
const currentNa = ref<number | null>(null);
const targetNa = ref<number | null>(140);

watchEffect(() => {
	age.value = currentPatient.value.age || null;
	weight.value = currentPatient.value.weight;
});

const tbw = computed(() => {
	if (!weight.value || !age.value) return null;

	let factor = 0;
	if (gender.value === "Masculino") {
		factor = age.value < 65 ? 0.6 : 0.5;
	} else {
		factor = age.value < 65 ? 0.5 : 0.45;
	}

	return weight.value * factor;
});

const deficit = computed(() => {
	if (!tbw.value || !currentNa.value || !targetNa.value || targetNa.value <= 0)
		return null;
	if (currentNa.value <= targetNa.value) return 0; // No deficit if Na is normal/low

	return tbw.value * (currentNa.value / targetNa.value - 1);
});

const copyToClipboard = () => {
	if (deficit.value === null) return;
	const text = `Déficit de Água Livre (Correção de Sódio):
- Sexo: ${gender.value} | Idade: ${age.value}a | Peso: ${weight.value}kg
- Na+ Atual: ${currentNa.value} mEq/L
- Na+ Alvo: ${targetNa.value} mEq/L
-> Déficit de Água calculado: ${deficit.value.toFixed(1)} Litros
(Reduzir máximo 10-12 mEq/L em 24h)`;
	copyRawText(text);
};
</script>

<style scoped>
.calculator-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>

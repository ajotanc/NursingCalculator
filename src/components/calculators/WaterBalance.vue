<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Balanço Hídrico
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Calcule o volume exato de Entradas (In) e Saídas (Out) do paciente para encontrar o Saldo Hídrico.
    </div>

    <v-row>
      <!-- ENTRADAS -->
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <div class="text-h6 mb-4 d-flex align-center text-blue-darken-2">
            <v-icon icon="mdi-water-plus" class="mr-2"></v-icon> Entradas (In)
          </div>

          <NumericInput v-model.number="inSoro" label="Soros / Hidratação IV" suffix="mL" variant="underlined" min="0"
            class="mb-2" />
          <NumericInput v-model.number="inMeds" label="Medicações IV (Diluições)" suffix="mL" variant="underlined"
            min="0" class="mb-2" />
          <NumericInput v-model.number="inDiet" label="Dieta Enteral / VO" suffix="mL" variant="underlined" min="0"
            class="mb-2" />
          <NumericInput v-model.number="inOther" label="Outras Entradas (Transfusão, etc)" suffix="mL"
            variant="underlined" min="0" />

          <div class="text-h6 text-right mt-4 text-blue-darken-2">
            Total IN: {{ totalIn }} mL
          </div>
        </v-card>
      </v-col>

      <!-- SAÍDAS -->
      <v-col cols="12" md="6">
        <v-card color="orange-darken-2" class="pa-4">
          <div class="text-h6 mb-4 d-flex align-center">
            <v-icon icon="mdi-water-minus" class="mr-2"></v-icon> Saídas (Out)
          </div>

          <NumericInput v-model.number="outDiuresis" label="Diurese" suffix="mL" variant="underlined" min="0"
            class="mb-2" />
          <NumericInput v-model.number="outDrains" label="Drenos" suffix="mL" variant="underlined" min="0"
            class="mb-2" />
          <NumericInput v-model.number="outVomit" label="Vômito / Estase Gástrica" suffix="mL" variant="underlined"
            min="0" class="mb-2" />
          <NumericInput v-model.number="outOther" label="Outras Saídas (Fezes, etc)" suffix="mL" variant="underlined"
            min="0" />

          <div class="text-h6 text-right mt-4 text-orange-darken-2">
            Total OUT: {{ totalOut }} mL
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-row v-if="totalIn > 0 || totalOut > 0">
      <v-col cols="12">
        <v-card :color="balanceColor + '-lighten-4'" class="pa-4 text-center rounded">
          <div :class="`text-subtitle-2 text-${balanceColor}-darken-2 text-uppercase`">Saldo do Balanço Hídrico</div>
          <div :class="`text-h3 font-weight-black text-${balanceColor}-darken-3 my-2`">
            {{ balance > 0 ? '+' : '' }}{{ balance }} mL
          </div>
          <div :class="`text-subtitle-1 text-${balanceColor}-darken-2`">
            {{ balance > 0 ? 'Balanço Positivo (Retenção)' : balance < 0 ? 'Balanço Negativo (Perda)' : 'Balanço Zerado'
              }} </div>
        </v-card>
      </v-col>
    </v-row>

    <CalculatorActions @copy="copyToClipboard('WaterBalance', copyText)" @reset="resetForm" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import CalculatorActions from "@/components/CalculatorActions.vue";
import NumericInput from "@/components/NumericInput.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";

const { copyToClipboard } = useAppClipboard();

// Entradas
const inSoro = ref<number | null>(null);
const inMeds = ref<number | null>(null);
const inDiet = ref<number | null>(null);
const inOther = ref<number | null>(null);

// Saídas
const outDiuresis = ref<number | null>(null);
const outDrains = ref<number | null>(null);
const outVomit = ref<number | null>(null);
const outOther = ref<number | null>(null);

const resetForm = (): void => {
	inSoro.value = null;
	inMeds.value = null;
	inDiet.value = null;
	inOther.value = null;

	outDiuresis.value = null;
	outDrains.value = null;
	outVomit.value = null;
	outOther.value = null;
};

const totalIn = computed(() => {
	return (
		(inSoro.value || 0) +
		(inMeds.value || 0) +
		(inDiet.value || 0) +
		(inOther.value || 0)
	);
});

const totalOut = computed(() => {
	return (
		(outDiuresis.value || 0) +
		(outDrains.value || 0) +
		(outVomit.value || 0) +
		(outOther.value || 0)
	);
});

const balance = computed(() => {
	return totalIn.value - totalOut.value;
});

const balanceColor = computed(() => {
	if (balance.value > 0) return "blue";
	if (balance.value < 0) return "red";
	return "green";
});

const copyText = computed(() => {
	return `Balanço Hídrico:\nEntradas (IN): ${totalIn.value} mL\nSaídas (OUT): ${totalOut.value} mL\nSaldo: ${balance.value > 0 ? "+" : ""}${balance.value} mL`;
});
</script>

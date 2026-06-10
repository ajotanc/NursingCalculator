<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Previsão de Término
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Descubra exatamente que horas uma infusão contínua vai acabar.
    </div>

    <v-row>
      <v-col cols="12" sm="6">
        <NumericInput v-model.number="volume" label="Volume Restante (mL)" variant="outlined" suffix="mL" min="0"
          hide-details="auto"></NumericInput>
      </v-col>
      <v-col cols="12" sm="6">
        <NumericInput v-model.number="rate" label="Vazão Atual (mL/h)" variant="outlined" suffix="mL/h" min="0"
          hide-details="auto"></NumericInput>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="startTime" type="time" label="Horário de Início/Agora" variant="outlined"
          hide-details="auto" color="primary" @click="openPicker"></v-text-field>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-row v-if="durationInMinutes > 0">
      <v-col cols="12" sm="6">
        <v-card color="grey-lighten-4" class="pa-4 text-center rounded" elevation="0">
          <div class="text-subtitle-2 text-grey-darken-2 text-uppercase">Duração Total</div>
          <div class="text-h4 font-weight-black text-grey-darken-3 my-2">
            {{ formatDuration(durationInMinutes) }}
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card color="primary-lighten-4" class="pa-4 text-center rounded" elevation="0">
          <div class="text-subtitle-2 text-primary-darken-2 text-uppercase">Término Previsto</div>
          <div class="text-h3 font-weight-black text-primary-darken-3 my-2">
            {{ expectedEndTime }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <CalculatorActions @copy="copyToClipboard('InfusionTime', copyText)" @reset="resetForm" />
  </v-container>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { computed, onMounted, ref } from "vue";
import CalculatorActions from "@/components/CalculatorActions.vue";
import NumericInput from "@/components/NumericInput.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";

const { copyToClipboard } = useAppClipboard();

const volume = ref<number | null>(null);
const rate = ref<number | null>(null);
const startTime = ref<string>("");

const openPicker = (e: Event) => {
	const target = e.currentTarget as HTMLElement;
	if (!target) return;
	const input = target.querySelector('input[type="time"]') as HTMLInputElement;
	if (input && typeof input.showPicker === "function") {
		try {
			input.showPicker();
		} catch (err) {
			if (err instanceof Error) {
				console.log(err.message);
			}
		}
	}
};

onMounted(() => {
	startTime.value = dayjs().format("HH:mm");
});

const resetForm = (): void => {
	volume.value = null;
	rate.value = null;
	startTime.value = dayjs().format("HH:mm");
};

const durationInMinutes = computed<number>(() => {
	if (!volume.value || !rate.value || rate.value <= 0) return 0;
	return (volume.value / rate.value) * 60;
});

const formatDuration = (totalMinutes: number): string => {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = Math.round(totalMinutes % 60);
	if (hours === 0) return `${minutes} min`;
	return `${hours}h ${minutes}m`;
};

const expectedEndTime = computed<string>(() => {
	if (durationInMinutes.value <= 0 || !startTime.value) return "--:--";

	const [startH, startM] = startTime.value.split(":").map(Number);
	const startDate = dayjs().hour(startH).minute(startM).second(0);
	const endDate = startDate.add(durationInMinutes.value, "minute");

	const endH = endDate.format("HH");
	const endM = endDate.format("mm");

	// Se passou da meia noite do dia atual, avisa que é no dia seguinte
	const isNextDay = endDate.date() !== startDate.date();
	return `${endH}:${endM} ${isNextDay ? "(+1 dia)" : ""}`;
});

const copyText = computed(() => {
	return `Previsão de Término:\nVolume: ${volume.value || 0} mL | Vazão: ${rate.value || 0} mL/h\nInício: ${startTime.value}\nDuração: ${formatDuration(durationInMinutes.value)}\nHorário de Término: ${expectedEndTime.value}`;
});
</script>

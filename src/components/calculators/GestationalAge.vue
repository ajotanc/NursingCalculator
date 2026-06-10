<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Idade Gestacional e DPP
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Calcule a Idade Gestacional atual e a Data Provável do Parto a partir da DUM (Data da Última Menstruação).
    </div>

    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="dumDate"
          type="date"
          label="DUM (Data Última Menstruação)"
          variant="outlined"
          hide-details="auto"
          color="primary"
          @click="openPicker"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="currentDate"
          type="date"
          label="Data Atual / Data do Cálculo"
          variant="outlined"
          hide-details="auto"
          color="primary"
          @click="openPicker"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-row v-if="isValidDates">
      <v-col cols="12" sm="6">
        <v-card color="primary-lighten-4" class="pa-4 text-center rounded-lg" elevation="0">
          <div class="text-subtitle-2 text-primary-darken-2 text-uppercase">Idade Gestacional (IG)</div>
          <div class="text-h3 font-weight-black text-primary-darken-3 my-2">
            {{ igWeeks }} <span class="text-h5">sem</span> <br v-if="igDays > 0"/> <span v-if="igDays > 0">{{ igDays }} <span class="text-h5">dias</span></span>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card color="purple-lighten-4" class="pa-4 text-center rounded-lg" elevation="0">
          <div class="text-subtitle-2 text-purple-darken-2 text-uppercase">Data Provável do Parto (DPP)</div>
          <div class="text-h4 font-weight-black text-purple-darken-3 my-2 mt-4">
            {{ dppDateDisplay }}
          </div>
          <div class="text-caption text-purple-darken-2 mt-2">40 Semanas</div>
        </v-card>
      </v-col>
    </v-row>

    <CalculatorActions @copy="copyToClipboard('GestationalAge', copyText)" @reset="resetForm" />
  </v-container>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { computed, onMounted, ref } from "vue";
import CalculatorActions from "@/components/CalculatorActions.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";

dayjs.extend(isSameOrAfter);

const { copyToClipboard } = useAppClipboard();

const dumDate = ref<string>("");
const currentDate = ref<string>("");

// Helper para abrir o calendário em qualquer lugar do input
const openPicker = (e: Event) => {
	const target = e.currentTarget as HTMLElement;
	if (!target) return;
	const input = target.querySelector('input[type="date"]') as HTMLInputElement;
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
	currentDate.value = dayjs().format("YYYY-MM-DD");
});

const resetForm = (): void => {
	dumDate.value = "";
	currentDate.value = dayjs().format("YYYY-MM-DD");
};

const isValidDates = computed(() => {
	return (
		dumDate.value !== "" &&
		currentDate.value !== "" &&
		dayjs(currentDate.value).isSameOrAfter(dayjs(dumDate.value))
	);
});

const totalDays = computed(() => {
	if (!isValidDates.value) return 0;
	return dayjs(currentDate.value).diff(dayjs(dumDate.value), "day");
});

const igWeeks = computed(() => Math.floor(totalDays.value / 7));
const igDays = computed(() => totalDays.value % 7);

const dppDateDisplay = computed(() => {
	if (!dumDate.value) return "";
	return dayjs(dumDate.value).add(280, "day").format("DD/MM/YYYY");
});

const dumDateDisplay = computed(() => {
	if (!dumDate.value) return "";
	return dayjs(dumDate.value).format("DD/MM/YYYY");
});

const copyText = computed(() => {
	return `Idade Gestacional:\nDUM: ${dumDateDisplay.value}\nIG Atual: ${igWeeks.value} semanas e ${igDays.value} dias\nDPP: ${dppDateDisplay.value}`;
});
</script>

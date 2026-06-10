<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Dashboard
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Bem-vindo ao {{ APP_NAME }}. Acesse rapidamente suas ferramentas ou veja seu histórico de evoluções.
    </div>

    <!-- Quick Actions -->
    <v-row class="mb-6">
      <v-col cols="6" sm="3" md="3">
        <v-card color="primary-lighten-4" class="pa-4 text-center rounded-lg" elevation="0" @click="$emit('navigate', 'mav')">
          <v-icon size="36" color="primary-darken-2">mdi-alert</v-icon>
          <div class="text-subtitle-2 text-primary-darken-2 mt-2 font-weight-bold">MAVs</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="red-lighten-4" class="pa-4 text-center rounded-lg" elevation="0" @click="$emit('navigate', 'vasoactive')">
          <v-icon size="36" color="red-darken-4">mdi-heart-pulse</v-icon>
          <div class="text-subtitle-2 text-red-darken-4 mt-2 font-weight-bold">Drogas Vasoat.</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="cyan-lighten-4" class="pa-4 text-center rounded-lg" elevation="0" @click="$emit('navigate', 'bic')">
          <v-icon size="36" color="cyan-darken-4">mdi-pump</v-icon>
          <div class="text-subtitle-2 text-cyan-darken-4 mt-2 font-weight-bold">Bomba (BIC)</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="indigo-lighten-4" class="pa-4 text-center rounded-lg" elevation="0" @click="$emit('navigate', 'electrolytes')">
          <v-icon size="36" color="indigo-darken-4">mdi-test-tube</v-icon>
          <div class="text-subtitle-2 text-indigo-darken-4 mt-2 font-weight-bold">Eletrólitos</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="green-lighten-4" class="pa-4 text-center rounded-lg" elevation="0" @click="$emit('navigate', 'waterbalance')">
          <v-icon size="36" color="green-darken-4">mdi-scale-balance</v-icon>
          <div class="text-subtitle-2 text-green-darken-4 mt-2 font-weight-bold">Bal. Hídrico</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="deep-orange-lighten-4" class="pa-4 text-center rounded-lg" elevation="0" @click="$emit('navigate', 'earlywarning')">
          <v-icon size="36" color="deep-orange-darken-4">mdi-alert-octagon</v-icon>
          <div class="text-subtitle-2 text-deep-orange-darken-4 mt-2 font-weight-bold">Escala MEWS</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="orange-lighten-4" class="pa-4 text-center rounded-lg" elevation="0" @click="$emit('navigate', 'glasgow')">
          <v-icon size="36" color="orange-darken-4">mdi-eye</v-icon>
          <div class="text-subtitle-2 text-orange-darken-4 mt-2 font-weight-bold">Glasgow</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="blue-lighten-4" class="pa-4 text-center rounded-lg" elevation="0" @click="$emit('navigate', 'drip')">
          <v-icon size="36" color="blue-darken-4">mdi-water</v-icon>
          <div class="text-subtitle-2 text-blue-darken-4 mt-2 font-weight-bold">Gotejamento</div>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="mb-6"></v-divider>

    <!-- History -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-h6 text-primary font-weight-bold">Histórico Recente</div>
      <v-btn v-if="history.length > 0" variant="text" color="error" size="small" @click="clearHistory">
        Limpar
      </v-btn>
    </div>

    <v-card v-if="history.length === 0" variant="tonal" color="grey" class="pa-6 text-center">
      <v-icon size="48" color="grey-lighten-1">mdi-history</v-icon>
      <div class="mt-2 text-grey-darken-1">Nenhuma evolução foi copiada ainda.</div>
      <div class="text-caption text-grey">Seus cálculos copiados aparecerão aqui.</div>
    </v-card>

    <v-timeline v-else density="compact" align="start" side="end">
      <v-timeline-item
        v-for="item in history"
        :key="item.id"
        dot-color="primary"
        size="small"
      >
        <v-card variant="outlined" class="mb-4">
          <v-card-item class="pb-2">
            <template v-slot:title>
              <div class="text-subtitle-1 font-weight-bold text-primary">{{ getHumanReadableName(item.calculatorName) }}</div>
            </template>
            <template v-slot:subtitle>
              <div class="text-caption">{{ formatTimestamp(item.timestamp) }}</div>
            </template>
          </v-card-item>
          <v-card-text class="pt-0 text-body-2" style="white-space: pre-wrap;">
            {{ formatBodyText(item.text) }}
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>

  </v-container>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useHistory } from "@/composables/useHistory";
import { APP_NAME } from "@/utils/config";

defineEmits(["navigate"]);

const { history, clearHistory } = useHistory();

const calculatorNamesMap: Record<string, string> = {
	ClinicalEvaluation: "Avaliação Clínica",
	DosageConverter: "Regra de Três",
	DripRate: "Gotejamento Padrão",
	GlasgowScale: "Escala de Glasgow",
	InfusionPump: "Bomba de Infusão (BIC)",
	InsulinScale: "Escala de Insulina",
	MavProtocols: "Protocolos MAV",
	PediatricDose: "Dose Pediátrica",
	PenicillinDilution: "Diluição de Penicilina",
	SerumTransformation: "Transformação de Soro",
	VasoactiveDrugs: "Drogas Vasoativas",
	InfusionTime: "Término de Infusão",
	GestationalAge: "Idade Gestacional e DPP",
	BradenScale: "Escala de Braden",
	MorseScale: "Escala de Morse",
	WaterBalance: "Balanço Hídrico",
	EarlyWarningScale: "Escala MEWS",
	ApgarScore: "Índice de APGAR",
	ParklandFormula: "Fórmula de Parkland",
	ElectrolyteReplacement: "Reposição de Eletrólitos",
};

const getHumanReadableName = (name: string): string => {
	return calculatorNamesMap[name] || name;
};

const formatBodyText = (text: string): string => {
	const lines = text.split("\n");
	if (lines.length > 1 && lines[0].includes(":")) {
		return lines.slice(1).join("\n").trim();
	}
	return text;
};

const formatTimestamp = (ts: number): string => {
	return dayjs(ts).format("DD/MM/YYYY HH:mm");
};
</script>

<template>
  <v-container class="pa-6">
    <div class="text-h5 text-teal-darken-2 mb-4 font-weight-bold">
      Dashboard
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Bem-vindo ao NursingCalculator. Acesse rapidamente suas ferramentas ou veja seu histórico de evoluções.
    </div>

    <!-- Quick Actions -->
    <v-row class="mb-6">
      <v-col cols="6" sm="3">
        <v-card color="teal-lighten-4" class="pa-4 text-center rounded-lg" elevation="0" @click="$emit('navigate', 'mav')">
          <v-icon size="36" color="teal-darken-4">mdi-alert</v-icon>
          <div class="text-subtitle-2 text-teal-darken-4 mt-2 font-weight-bold">MAVs</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card color="blue-lighten-4" class="pa-4 text-center rounded-lg" elevation="0" @click="$emit('navigate', 'drip')">
          <v-icon size="36" color="blue-darken-4">mdi-water</v-icon>
          <div class="text-subtitle-2 text-blue-darken-4 mt-2 font-weight-bold">Gotejamento</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card color="purple-lighten-4" class="pa-4 text-center rounded-lg" elevation="0" @click="$emit('navigate', 'pediatric')">
          <v-icon size="36" color="purple-darken-4">mdi-baby-face-outline</v-icon>
          <div class="text-subtitle-2 text-purple-darken-4 mt-2 font-weight-bold">Pediatria</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card color="orange-lighten-4" class="pa-4 text-center rounded-lg" elevation="0" @click="$emit('navigate', 'glasgow')">
          <v-icon size="36" color="orange-darken-4">mdi-eye</v-icon>
          <div class="text-subtitle-2 text-orange-darken-4 mt-2 font-weight-bold">Glasgow</div>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="mb-6"></v-divider>

    <!-- History -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-h6 text-teal-darken-2 font-weight-bold">Histórico Recente</div>
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
        dot-color="teal-darken-1"
        size="small"
      >
        <v-card variant="outlined" class="mb-4">
          <v-card-item class="pb-2">
            <template v-slot:title>
              <div class="text-subtitle-1 font-weight-bold text-teal-darken-2">{{ getHumanReadableName(item.calculatorName) }}</div>
            </template>
            <template v-slot:subtitle>
              <div class="text-caption">{{ new Date(item.timestamp).toLocaleString() }}</div>
            </template>
          </v-card-item>
          <v-card-text class="pt-0 text-body-2">
            {{ item.text }}
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>

  </v-container>
</template>

<script setup lang="ts">
import { useHistory } from "@/composables/useHistory";

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
};

const getHumanReadableName = (name: string): string => {
	return calculatorNamesMap[name] || name;
};
</script>

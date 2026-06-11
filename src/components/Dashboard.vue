<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Dashboard
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Bem-vindo ao <strong>{{ APP_NAME }}</strong>. Acesse rapidamente suas ferramentas ou veja seu histórico de
      evoluções.
    </div>

    <!-- Perfil do Paciente (unificado) -->
    <v-card class="mb-6">
      <!-- EMPTY STATE -->
      <div v-if="!hasPatientData" class="d-flex align-center justify-space-between pa-3 px-4"
        style="opacity: 0.8;">
        <div class="d-flex align-center ga-3">
          <v-icon icon="mdi-account-plus" color="primary"></v-icon>
          <div class="text-body-2 font-weight-medium">Nenhum paciente selecionado</div>
        </div>
        <v-btn size="small" color="primary" variant="tonal" class="font-weight-bold" @click="$emit('edit-patient')">
          Configurar
        </v-btn>
      </div>

      <!-- ACTIVE STATE -->
      <div v-else class="pt-3 pb-3">
        <div class="d-flex align-center justify-space-between px-4 mb-3">
          <div class="d-flex align-center ga-3">
            <v-badge dot color="success" location="bottom right" offset-x="2" offset-y="2">
              <v-avatar size="40" color="primary" variant="tonal">
                <v-icon icon="mdi-account" size="24"></v-icon>
              </v-avatar>
            </v-badge>
            <div>
              <div class="text-subtitle-1 font-weight-bold" style="line-height: 1.1;">
                {{ currentPatient.name || 'Paciente Atual' }}
              </div>
              <v-chip v-if="currentPatient.fallRisk" size="x-small" color="error" variant="flat"
                class="mt-1 font-weight-bold" style="height: 18px;">
                Risco de Queda
              </v-chip>
            </div>
          </div>
          <v-btn icon="mdi-account-switch-outline" variant="tonal" size="small" color="primary" class="ma-0 rounded"
            style="width: 28px; height: 28px;" @click="$emit('edit-patient')"></v-btn>
        </div>

        <!-- Basic Info Only (Idade, Peso, Altura) -->
        <div class="px-4 d-flex flex-wrap align-center ga-4">
          <div v-if="currentPatient.age" class="d-flex align-center ga-2">
            <v-icon color="blue" size="18">mdi-calendar-blank</v-icon>
            <div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1;">Idade</div>
              <div class="text-body-2 font-weight-bold" style="line-height: 1.2;">{{ currentPatient.age }} anos</div>
            </div>
          </div>
          <div v-if="currentPatient.weight" class="d-flex align-center ga-2">
            <v-icon color="teal" size="18">mdi-scale</v-icon>
            <div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1;">Peso</div>
              <div class="text-body-2 font-weight-bold" style="line-height: 1.2;">{{ currentPatient.weight }} kg</div>
            </div>
          </div>
          <div v-if="currentPatient.height" class="d-flex align-center ga-2">
            <v-icon color="indigo" size="18">mdi-human-male-height</v-icon>
            <div>
              <div class="text-caption text-medium-emphasis" style="line-height: 1;">Altura</div>
              <div class="text-body-2 font-weight-bold" style="line-height: 1.2;">{{ currentPatient.height }} cm</div>
            </div>
          </div>

          <div v-if="!currentPatient.age && !currentPatient.weight && !currentPatient.height"
            class="text-caption text-grey">
            Dados básicos não informados.
          </div>
        </div>

        <!-- Divider if there are clinical vitals -->
        <v-divider class="my-3 mx-4" v-if="clinicalVitals.length > 0" style="opacity: 0.5;"></v-divider>

        <!-- Ultra-compact Clinical Vitals (Icons + Values ONLY) -->
        <div v-if="clinicalVitals.length > 0" class="px-4 d-flex flex-wrap align-center ga-2">
          <template v-for="field in clinicalVitals" :key="field.key">
            <v-chip size="small" variant="flat" style="background: rgba(var(--v-theme-on-surface), 0.04);"
              class="border font-weight-medium px-2">
              <v-icon start :color="field.color" size="14">{{ field.icon }}</v-icon>
              <span class="text-high-emphasis font-weight-bold" style="letter-spacing: 0.2px;">
                {{ field.value }}<span v-if="field.unit" class="text-caption text-medium-emphasis ml-1">{{ field.unit
                  }}</span>
              </span>
            </v-chip>
          </template>
        </div>
      </div>
    </v-card>

    <!-- Quick Actions -->
    <v-row class="mb-6">
      <v-col cols="6" sm="3" md="3">
        <v-card color="primary" variant="tonal" class="pa-4 text-center rounded" :border="false"
          @click="$emit('navigate', 'mav')">
          <v-icon size="36">mdi-alert</v-icon>
          <div class="text-subtitle-2 mt-2 font-weight-bold">MAVs</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="red" variant="tonal" class="pa-4 text-center rounded" :border="false"
          @click="$emit('navigate', 'vasoactive')">
          <v-icon size="36">mdi-heart-pulse</v-icon>
          <div class="text-subtitle-2 mt-2 font-weight-bold">Drogas Vasoat.</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="cyan" variant="tonal" class="pa-4 text-center rounded" :border="false"
          @click="$emit('navigate', 'bic')">
          <v-icon size="36">mdi-pump</v-icon>
          <div class="text-subtitle-2 mt-2 font-weight-bold">Bomba (BIC)</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="indigo" variant="tonal" class="pa-4 text-center rounded" :border="false"
          @click="$emit('navigate', 'electrolytes')">
          <v-icon size="36">mdi-test-tube</v-icon>
          <div class="text-subtitle-2 mt-2 font-weight-bold">Eletrólitos</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="green" variant="tonal" class="pa-4 text-center rounded" :border="false"
          @click="$emit('navigate', 'waterbalance')">
          <v-icon size="36">mdi-scale-balance</v-icon>
          <div class="text-subtitle-2 mt-2 font-weight-bold">Bal. Hídrico</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="deep-orange" variant="tonal" class="pa-4 text-center rounded" :border="false"
          @click="$emit('navigate', 'earlywarning')">
          <v-icon size="36">mdi-alert-octagon</v-icon>
          <div class="text-subtitle-2 mt-2 font-weight-bold">Escala MEWS</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="orange" variant="tonal" class="pa-4 text-center rounded" :border="false"
          @click="$emit('navigate', 'glasgow')">
          <v-icon size="36">mdi-eye</v-icon>
          <div class="text-subtitle-2 mt-2 font-weight-bold">Glasgow</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="blue" variant="tonal" class="pa-4 text-center rounded" :border="false"
          @click="$emit('navigate', 'drip')">
          <v-icon size="36">mdi-water</v-icon>
          <div class="text-subtitle-2 mt-2 font-weight-bold">Gotejamento</div>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="mb-6 shrink-0"></v-divider>

    <!-- History Section -->
    <div class="d-flex flex-column flex-md-row align-center justify-space-between shrink-0">
      <h2 class="text-h5 font-weight-bold text-primary">histórico Recente</h2>
      <div v-if="history.length > 0" class="d-flex ga-2">
        <v-icon-btn color="grey" variant="text" size="small" icon="mdi-clipboard-multiple" @click="copyAllHistory" />
        <v-icon-btn color="error" variant="text" size="small" icon="mdi-file-pdf-box" @click="generatePDF" />
        <v-icon-btn color="grey" variant="text" size="small" icon="mdi-delete" @click="handleClearHistory" />
      </div>
    </div>

    <v-card v-if="history.length === 0" variant="tonal" color="grey" class="pa-6 text-center">
      <v-icon size="48" color="grey-lighten-1">mdi-history</v-icon>
      <div class="mt-2 text-grey-darken-1">Nenhuma evolução foi copiada ainda.</div>
      <div class="text-caption text-grey">Seus cálculos copiados aparecerão aqui.</div>
    </v-card>

    <v-timeline v-else density="compact" align="start" side="end">
      <v-timeline-item v-for="item in history" :key="item.id" dot-color="primary" size="small" width="100%">
        <v-card border class="w-100">
          <v-card-item class="pb-2">
            <template v-slot:title>
              <div class="d-flex justify-space-between align-center">
                <div class="text-title-medium text-lg-title-large font-weight-bold text-primary text-wrap"
                  style="line-height: 1.2;">
                  {{ getHumanReadableName(item.calculatorName) }}
                </div>
                <v-icon-btn variant="text" color="error" size="small" icon="mdi-delete-outline"
                  @click="handleDeleteItem(item.id)" />
              </div>
            </template>
            <template v-slot:subtitle>
              <div class="text-caption d-flex flex-column">
                <div class="d-flex align-center ga-2">
                  <v-icon size="small">mdi-clock-outline</v-icon>
                  <span>{{ formatTimestamp(item.timestamp) }}</span>
                </div>
                <div v-if="item.patientName" class="d-flex align-center ga-2">
                  <v-icon size="small">mdi-bed-outline</v-icon>
                  <span>{{ item.patientName }}</span>
                </div>
              </div>
            </template>
          </v-card-item>

          <v-card-text class="pt-0">
            <pre class="text-body-2 font-weight-medium bg-transparent ext-wrap ma-0"
              style="white-space: pre-wrap; font-family: inherit;">{{ formatBodyText(item.text) }}</pre>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { computed } from "vue";
import { useAppClipboard } from "@/composables/useAppClipboard";
import { useHaptics } from "@/composables/useHaptics";
import { type HistoryItem, useHistory } from "@/composables/useHistory";
import { usePatient } from "@/composables/usePatient";
import { APP_NAME } from "@/utils/config";

const { currentPatient, hasPatientData, vitaisFields } = usePatient();
const { history, clearHistory, deleteItem } = useHistory();
const { copyRawText } = useAppClipboard();
const { vibrateSuccess, vibrateError } = useHaptics();

defineEmits(["navigate", "edit-patient"]);

// Only return clinical vitals (excluding name, basic anthropometrics, and fallRisk)
const clinicalVitals = computed(() => {
	if (!hasPatientData.value) return [];
	const excludeKeys = ["name", "age", "weight", "height", "fallRisk"];
	return vitaisFields.value.filter(
		(f) => f.value !== null && !excludeKeys.includes(f.key),
	);
});

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

const copyAllHistory = () => {
	if (history.value.length === 0) return;
	vibrateSuccess();

	const allText = history.value
		.map((item) => {
			const header = `[${formatTimestamp(item.timestamp)}] ${getHumanReadableName(item.calculatorName)}`;

			let patient = "";
			if (item.patientName) {
				patient = item.patientVitals
					? `\nPaciente/Leito: ${item.patientName} (${item.patientVitals})`
					: `\nPaciente/Leito: ${item.patientName}`;
			}

			return `${header}${patient}\n${formatBodyText(item.text)}`;
		})
		.join("\n\n--------------------------------\n\n");

	copyRawText(allText);
};

const handleDeleteItem = (id: string) => {
	vibrateError();
	deleteItem(id);
};

const handleClearHistory = () => {
	vibrateError();
	clearHistory();
};

const generatePDF = () => {
	if (history.value.length === 0) return;
	vibrateSuccess();

	const doc = new jsPDF({
		orientation: "landscape",
		unit: "mm",
		format: "a4",
	});

	doc.setFontSize(18);
	doc.text("histórico de Plantão - Nursing Calculator", 14, 22);

	doc.setFontSize(11);
	doc.setTextColor(100);
	doc.text(`Gerado em: ${dayjs().format("DD/MM/YYYY HH:mm")}`, 14, 30);

	const tableData = history.value.map((item: HistoryItem) => {
		const bed = item.patientName || "-";
		const vitals = item.patientVitals || "-";

		return [
			formatTimestamp(item.timestamp),
			bed,
			vitals,
			getHumanReadableName(item.calculatorName),
			formatBodyText(item.text).replace(/\n/g, "  |  "),
		];
	});

	autoTable(doc, {
		startY: 36,
		head: [["Data/Hora", "Leito", "Sinais Vitais", "Calculadora", "Resultado"]],
		body: tableData,
		theme: "grid",
		headStyles: { fillColor: [24, 126, 177] },
	});

	doc.save(`Plantao_NC_${dayjs().format("YYYYMMDD_HHmm")}.pdf`);
};
</script>

<style>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
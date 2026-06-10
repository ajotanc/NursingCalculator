<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Dashboard
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Bem-vindo ao <strong>{{ APP_NAME }}</strong>. Acesse rapidamente suas ferramentas ou veja seu histórico de
      evoluções.
    </div>

    <!-- Quick Actions -->
    <v-row class="mb-6">
      <v-col cols="6" sm="3" md="3">
        <v-card color="primary" variant="tonal" class="pa-4 text-center rounded-lg" @click="$emit('navigate', 'mav')">
          <v-icon size="36">mdi-alert</v-icon>
          <div class="text-subtitle-2 mt-2 font-weight-bold">MAVs</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="red" variant="tonal" class="pa-4 text-center rounded-lg"
          @click="$emit('navigate', 'vasoactive')">
          <v-icon size="36">mdi-heart-pulse</v-icon>
          <div class="text-subtitle-2 mt-2 font-weight-bold">Drogas Vasoat.</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="cyan" variant="tonal" class="pa-4 text-center rounded-lg" @click="$emit('navigate', 'bic')">
          <v-icon size="36">mdi-pump</v-icon>
          <div class="text-subtitle-2 mt-2 font-weight-bold">Bomba (BIC)</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="indigo" variant="tonal" class="pa-4 text-center rounded-lg"
          @click="$emit('navigate', 'electrolytes')">
          <v-icon size="36">mdi-test-tube</v-icon>
          <div class="text-subtitle-2 mt-2 font-weight-bold">Eletrólitos</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="green" variant="tonal" class="pa-4 text-center rounded-lg"
          @click="$emit('navigate', 'waterbalance')">
          <v-icon size="36">mdi-scale-balance</v-icon>
          <div class="text-subtitle-2 mt-2 font-weight-bold">Bal. Hídrico</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="deep-orange" variant="tonal" class="pa-4 text-center rounded-lg"
          @click="$emit('navigate', 'earlywarning')">
          <v-icon size="36">mdi-alert-octagon</v-icon>
          <div class="text-subtitle-2 mt-2 font-weight-bold">Escala MEWS</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="orange" variant="tonal" class="pa-4 text-center rounded-lg"
          @click="$emit('navigate', 'glasgow')">
          <v-icon size="36">mdi-eye</v-icon>
          <div class="text-subtitle-2 mt-2 font-weight-bold">Glasgow</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3" md="3">
        <v-card color="blue" variant="tonal" class="pa-4 text-center rounded-lg" @click="$emit('navigate', 'drip')">
          <v-icon size="36">mdi-water</v-icon>
          <div class="text-subtitle-2 mt-2 font-weight-bold">Gotejamento</div>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="mb-6 flex-shrink-0"></v-divider>

    <!-- History Section -->
    <div class="d-flex flex-column flex-md-row align-center justify-space-between flex-shrink-0">
      <h2 class="text-h5 font-weight-bold text-primary">Histórico Recente</h2>
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
        <v-card variant="flat" border class="w-100">
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
import { useAppClipboard } from "@/composables/useAppClipboard";
import { useHaptics } from "@/composables/useHaptics";
import { type HistoryItem, useHistory } from "@/composables/useHistory";
import { APP_NAME } from "@/utils/config";

const { history, clearHistory, deleteItem } = useHistory();
const { copyRawText } = useAppClipboard();
const { vibrate, vibrateSuccess, vibrateError } = useHaptics();

defineEmits(["navigate"]);

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
	doc.text("Histórico de Plantão - Nursing Calculator", 14, 22);

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

<style lang="css" scoped>
.btn-delete-item {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
<template>
  <v-layout class="rounded-0 overflow-hidden" style="height: 100dvh; width: 100vw;">
    <v-app-bar color="primary" class="px-3" elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title @click="selectTab('dashboard')" style="cursor: pointer;">{{ APP_NAME }}</v-app-bar-title>
      <template v-slot:append>
        <v-btn icon color="white" @click="toggleTheme">
          <v-icon>{{ isDark ? 'mdi-brightness-4' : 'mdi-brightness-7' }}</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <div class="pa-3">
        <v-autocomplete v-model="searchQuery" :items="calculatorsList" item-title="title" item-value="value"
          label="Pesquisa rápida..." prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details
          auto-select-first clearable :custom-filter="searchFilter" :item-props="getItemProps"
          @update:model-value="onSearchSelect"></v-autocomplete>
      </div>

      <v-list-item lines="two" prepend-icon="mdi-account-injury"
        :title="hasPatientData ? (currentPatient.name || 'Paciente Atual') : 'Perfil do Paciente'"
        class="mx-2 rounded mb-2" variant="tonal" @click="showPatientDialog = true">
        <template v-slot:subtitle>
          <div v-if="hasPatientData"
            class="d-flex align-center mt-1 text-medium-emphasis text-caption font-weight-bold">
            <span v-if="currentPatient.age" class="mr-3 d-flex align-center">
              <v-icon icon="mdi-cake-variant" size="small" class="mr-1"></v-icon>
              {{ currentPatient.age }}a
            </span>
            <span v-if="currentPatient.weight" class="mr-3 d-flex align-center">
              <v-icon icon="mdi-weight-kilogram" size="small" class="mr-1"></v-icon>
              {{ currentPatient.weight }}kg
            </span>
            <span v-if="currentPatient.height" class="d-flex align-center">
              <v-icon icon="mdi-human-male-height" size="small" class="mr-1"></v-icon>
              {{ currentPatient.height }}cm
            </span>
          </div>
          <span v-else>Toque para definir Peso e Altura global...</span>
        </template>
      </v-list-item>

      <div v-if="hasPatientData && currentPatient.fallRisk"
        class="pa-2 ma-2 d-flex align-center bg-amber-lighten-4 text-amber-darken-4 text-body-medium border-warning rounded font-weight-bold">
        <v-icon icon="mdi-alert" size="small" class="mr-1"></v-icon>
        Paciente com Risco de Queda
      </div>

      <v-divider></v-divider>

      <v-list v-model:opened="openedGroups" nav density="compact">
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" :active="activeTab === 'dashboard'"
          @click="selectTab('dashboard')"></v-list-item>

        <v-list-group v-for="cat in calculatorCategories" :key="cat.name" :value="cat.name">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :prepend-icon="cat.icon" :title="cat.name"
              class="text-primary font-weight-bold"></v-list-item>
          </template>
          <v-list-item v-for="item in cat.items" :key="item.value" :title="item.title"
            :active="activeTab === item.value" @click="selectTab(item.value)"></v-list-item>
        </v-list-group>

        <v-divider class="my-2"></v-divider>
        <v-list-item prepend-icon="mdi-coffee" title="Buy me a Coffee" class="text-brown font-weight-bold"
          @click="showDonation = true"></v-list-item>
        <v-list-item prepend-icon="mdi-information-outline" title="Aviso Legal e Sobre"
          @click="showDisclaimer = true"></v-list-item>
      </v-list>

      <div class="mt-auto">
        <div class="pa-4 text-center">
          <div class="d-flex justify-center align-center ga-2 mb-1">
            <v-btn icon="mdi-linkedin" variant="text" size="small" color="primary"
              href="https://linkedin.com/in/ajotanc" target="_blank" aria-label="LinkedIn"></v-btn>
            <v-btn icon="mdi-github" variant="text" size="small" color="primary" href="https://github.com/ajotanc"
              target="_blank" aria-label="GitHub"></v-btn>
            <v-btn icon="mdi-instagram" variant="text" size="small" color="primary" href="https://instagram.com/ajotanc"
              target="_blank" aria-label="Instagram"></v-btn>
          </div>
          <div class="text-body-small text-grey font-weight-medium">
            AJOTA &copy; {{ dayjs().format("YYYY") }}. All rights reserved.
          </div>
        </div>
      </div>
    </v-navigation-drawer>

    <BaseDialog v-model="showDisclaimer" title="Aviso Legal" icon="mdi-shield-alert" max-width="480">
      <v-card-text class="pa-5 text-body-1">
        <p class="mb-4">O <strong>Nursing Calculator</strong> é uma ferramenta educacional e de apoio clínico,
          projetada
          para auxiliar profissionais de saúde em cálculos matemáticos rápidos.</p>
        <v-alert type="error" variant="tonal" class="mb-4">
          A responsabilidade final pela checagem, preparo e administração de qualquer terapia, bem como a adequação
          clínica, é <strong>exclusivamente do profissional de saúde assistente</strong>. Use sempre seu julgamento
          clínico para validar os resultados.
        </v-alert>
        <p><strong>Privacidade e Offline-First:</strong> Este aplicativo processa todos os cálculos diretamente no seu
          aparelho. Nenhum dado do paciente ou cálculo realizado é salvo ou enviado para servidores externos.</p>
      </v-card-text>
      <template #actions>
        <v-btn color="primary" variant="flat" class="px-6" @click="showDisclaimer = false">Ciente e Concordo</v-btn>
      </template>
    </BaseDialog>

    <BaseDialog v-model="showDonation" max-width="480">
      <v-card-text class="text-center">
        <v-icon icon="mdi-coffee" color="brown" class="mt-4" size="64"></v-icon>
        <h2 class="text-h5 font-weight-bold mb-2">Buy me a Coffee! ☕</h2>
        <p class="text-body-2 text-medium-emphasis">
          Este aplicativo é gratuito e sem anúncios. Se ele te ajuda no plantão, considere pagar um café para o
          desenvolvedor!
        </p>

        <v-card variant="tonal" color="brown-lighten-4" class="mb-4 mt-6 rounded">
          <div class="text-caption text-brown-darken-4 font-weight-bold mb-1 pt-2">Chave PIX (Copia e Cola)</div>
          <div class="d-flex align-center bg-white rounded pa-2 border mx-2 mb-2">
            <div class="text-body-2 text-truncate grow" style="user-select: all;">
              {{ pixKey }}
            </div>
            <v-btn icon="mdi-content-copy" size="small" variant="text" color="brown" @click="copyPixKey"
              :title="copiedPix ? 'Copiado!' : 'Copiar'"></v-btn>
          </div>
          <div v-if="copiedPix" class="text-caption text-success mt-1 mb-2 font-weight-bold">Chave copiada com sucesso!
          </div>
        </v-card>
      </v-card-text>
      <template #actions>
        <div class="w-100 d-flex justify-center">
          <v-btn color="grey-darken-1" variant="text" @click="showDonation = false">Fechar</v-btn>
        </div>
      </template>
    </BaseDialog>

    <BaseDialog v-model="showPatientDialog" title="Gestão de Leitos" icon="mdi-bed" max-width="480">
      <v-card-text class="pa-4 bg-surface" style="max-height: 70vh; overflow-y: auto;">
        <!-- Formulário Novo Leito -->
        <v-card class="mb-4 pa-4" elevation="0" border rounded="lg" color="surface-light">
          <div class="text-subtitle-2 mb-3 text-primary font-weight-bold">Leito / Paciente</div>
          <v-row density="comfortable">
            <v-col cols="12">
              <v-text-field v-model="newBed.name" label="Identificação (Ex: Leito 04)" variant="outlined"
                density="compact" hide-details></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <NumericInput v-model.number="newBed.age" label="Idade" suffix="a" variant="outlined" density="compact"
                hide-details></NumericInput>
            </v-col>
            <v-col cols="12" sm="6">
              <NumericInput v-model.number="newBed.weight" label="Peso" suffix="kg" variant="outlined" density="compact"
                hide-details></NumericInput>
            </v-col>
            <v-col cols="12" sm="6">
              <NumericInput v-model.number="newBed.height" label="Altura" suffix="cm" variant="outlined"
                density="compact" hide-details></NumericInput>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="newBed.pa" label="PA" placeholder="120x80" suffix="mmHg" variant="outlined"
                density="compact" hide-details></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <NumericInput v-model.number="newBed.fc" label="FC" suffix="bpm" variant="outlined" density="compact"
                hide-details></NumericInput>
            </v-col>
            <v-col cols="12" sm="6">
              <NumericInput v-model.number="newBed.fr" label="FR" suffix="irpm" variant="outlined" density="compact"
                hide-details></NumericInput>
            </v-col>
            <v-col cols="12" sm="6">
              <NumericInput v-model.number="newBed.temp" label="Tax" suffix="°C" variant="outlined" density="compact"
                hide-details></NumericInput>
            </v-col>
            <v-col cols="12" sm="6">
              <NumericInput v-model.number="newBed.spO2" label="SpO2" suffix="%" variant="outlined" density="compact"
                hide-details></NumericInput>
            </v-col>
            <v-col cols="12">
              <v-switch v-model="newBed.fallRisk" color="warning" label="Risco de Queda" hide-details density="compact"
                inset class="inset-switch" size="x-small"></v-switch>
            </v-col>
            <v-col cols="12" class="text-right">
              <v-btn v-if="editBedId" color="grey" variant="text" @click="cancelEdit" class="mr-2">Cancelar</v-btn>
              <v-btn color="primary" variant="flat" @click="saveNewBed" :disabled="!newBed.name">
                {{ editBedId ? 'Salvar' : 'Adicionar' }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- Lista de Leitos -->
        <div class="text-subtitle-2 mb-2 px-1 font-weight-bold">Leitos do Plantão</div>
        <v-list class="bg-transparent pa-0" lines="two">
          <v-list-item v-for="p in patientsList" :key="p.id" class="mb-2 rounded border"
            :class="activePatientId === p.id ? 'border-primary bg-primary-lighten-5' : 'bg-surface'"
            @click="setActivePatient(p.id)">
            <template v-slot:prepend>
              <v-icon size="small" :color="activePatientId === p.id ? 'primary' : 'grey'">
                {{ activePatientId === p.id ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank' }}
              </v-icon>
            </template>
            <v-list-item-title class="font-weight-bold" :class="activePatientId === p.id ? 'text-primary' : ''">
              {{ p.name }}
            </v-list-item-title>
            <v-list-item-subtitle class="d-flex flex-wrap ga-1 mt-1">
              <v-chip variant="tonal" class="mr-2" size="small">
                <v-icon icon="mdi-cake-variant" start size="small"></v-icon>
                {{ p.age ? p.age + 'a' : '--' }}
              </v-chip>
              <v-chip variant="tonal" class="mr-2" size="small">
                <v-icon icon="mdi-weight-kilogram" start size="small"></v-icon>
                {{ p.weight ? p.weight + 'kg' : '--' }}
              </v-chip>
              <v-chip variant="tonal" size="small">
                <v-icon icon="mdi-human-male-height" start size="small"></v-icon>
                {{ p.height ? p.height + 'cm' : '--' }}
              </v-chip>
              <v-chip variant="tonal" size="small" color="warning" v-if="p.fallRisk">
                <v-icon icon="mdi-alert" color="warning" size="small" />
              </v-chip>
            </v-list-item-subtitle>
            <template v-slot:append>
              <v-btn icon="mdi-pencil-outline" variant="text" color="primary" size="small"
                @click.stop="editPatient(p)"></v-btn>
              <v-btn icon="mdi-delete-outline" variant="text" color="error" size="small"
                @click.stop="deletePatient(p.id)"></v-btn>
            </template>
          </v-list-item>

          <div v-if="patientsList.length === 0" class="text-center text-body-2 text-medium-emphasis py-6">
            <v-icon icon="mdi-bed-empty" size="large" class="mb-2 d-block mx-auto"></v-icon>
            Nenhum leito cadastrado neste plantão.
          </div>
        </v-list>
      </v-card-text>
      <template #actions>
        <div class="w-100 d-flex justify-center">
          <v-btn color="grey-darken-1" variant="text" @click="showPatientDialog = false">Fechar</v-btn>
        </div>
      </template>
    </BaseDialog>

    <v-main class="d-flex flex-column h-100">
      <v-card-text class="px-4 py-0" style="flex: 1 1 auto; min-height: 0; overflow-y: auto; overflow-x: hidden;">
        <v-window v-model="activeTab" :touch="false" style="overflow: visible;">
          <v-window-item value="dashboard">
            <Dashboard @navigate="selectTab" />
          </v-window-item>

          <v-window-item value="mav">
            <MavProtocols />
          </v-window-item>

          <v-window-item value="drip">
            <DripRate />
          </v-window-item>

          <v-window-item value="bic">
            <InfusionPump />
          </v-window-item>

          <v-window-item value="rule3">
            <DosageConverter />
          </v-window-item>

          <v-window-item value="serum">
            <SerumTransformation />
          </v-window-item>

          <v-window-item value="penicillin">
            <PenicillinDilution />
          </v-window-item>

          <v-window-item value="insulin">
            <InsulinScale />
          </v-window-item>

          <v-window-item value="clinical">
            <ClinicalEvaluation />
          </v-window-item>

          <v-window-item value="glasgow">
            <GlasgowScale />
          </v-window-item>

          <v-window-item value="pediatric">
            <PediatricDose />
          </v-window-item>

          <v-window-item value="vasoactive">
            <VasoactiveDrugs />
          </v-window-item>

          <v-window-item value="infusiontime">
            <InfusionTime />
          </v-window-item>

          <v-window-item value="gestational">
            <GestationalAge />
          </v-window-item>

          <v-window-item value="braden">
            <BradenScale />
          </v-window-item>

          <v-window-item value="morse">
            <MorseScale />
          </v-window-item>

          <v-window-item value="waterbalance">
            <WaterBalance />
          </v-window-item>

          <v-window-item value="earlywarning">
            <EarlyWarningScale />
          </v-window-item>

          <v-window-item value="apgar">
            <ApgarScore />
          </v-window-item>

          <v-window-item value="parkland">
            <ParklandFormula />
          </v-window-item>

          <v-window-item value="electrolytes">
            <ElectrolyteReplacement />
          </v-window-item>
          <v-window-item value="freewater">
            <FreeWaterDeficit />
          </v-window-item>
          <v-window-item value="catheter">
            <CatheterGuide />
          </v-window-item>
          <v-window-item value="abg">
            <AbgGuide />
          </v-window-item>
          <v-window-item value="ivfluids">
            <IvFluidsGuide />
          </v-window-item>
          <v-window-item value="ysite">
            <YSiteCompatibility />
          </v-window-item>
          <v-window-item value="blood_collection">
            <BloodCollection />
          </v-window-item>
          <v-window-item value="blood_transfusion">
            <BloodTransfusion />
          </v-window-item>
          <v-window-item value="preop_fasting">
            <PreopFasting />
          </v-window-item>
          <v-window-item value="acls_rhythms">
            <AclsRhythms />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-main>

    <v-snackbar v-model="showSnackbar" color="primary-darken-1" timeout="3000">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showSnackbar = false">Ok</v-btn>
      </template>
    </v-snackbar>
  </v-layout>
</template>

<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";
import dayjs from "dayjs";
import { computed, onMounted, ref, watch } from "vue";
import type { FilterFunction, InternalItem } from "vuetify";
import { useTheme } from "vuetify";
import BaseDialog from "@/components/BaseDialog.vue";
import AbgGuide from "@/components/calculators/AbgGuide.vue";
import AclsRhythms from "@/components/calculators/AclsRhythms.vue";
import BloodCollection from "@/components/calculators/BloodCollection.vue";
import BloodTransfusion from "@/components/calculators/BloodTransfusion.vue";
import BradenScale from "@/components/calculators/BradenScale.vue";
import CatheterGuide from "@/components/calculators/CatheterGuide.vue";
import ClinicalEvaluation from "@/components/calculators/ClinicalEvaluation.vue";
import DosageConverter from "@/components/calculators/DosageConverter.vue";
import DripRate from "@/components/calculators/DripRate.vue";
import FreeWaterDeficit from "@/components/calculators/FreeWaterDeficit.vue";
import GestationalAge from "@/components/calculators/GestationalAge.vue";
import GlasgowScale from "@/components/calculators/GlasgowScale.vue";
import InfusionPump from "@/components/calculators/InfusionPump.vue";
import InfusionTime from "@/components/calculators/InfusionTime.vue";
import InsulinScale from "@/components/calculators/InsulinScale.vue";
import IvFluidsGuide from "@/components/calculators/IvFluidsGuide.vue";
import MavProtocols from "@/components/calculators/MavProtocols.vue";
import MorseScale from "@/components/calculators/MorseScale.vue";
import PediatricDose from "@/components/calculators/PediatricDose.vue";
import PenicillinDilution from "@/components/calculators/PenicillinDilution.vue";
import PreopFasting from "@/components/calculators/PreopFasting.vue";
import SerumTransformation from "@/components/calculators/SerumTransformation.vue";
import VasoactiveDrugs from "@/components/calculators/VasoactiveDrugs.vue";
import WaterBalance from "@/components/calculators/WaterBalance.vue";
import YSiteCompatibility from "@/components/calculators/YSiteCompatibility.vue";
import Dashboard from "@/components/Dashboard.vue";
import NumericInput from "@/components/NumericInput.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";
import { activeTab, drawer, selectTab } from "@/composables/useNavigation";
import { type PatientProfile, usePatient } from "@/composables/usePatient";
import { APP_NAME } from "@/utils/config";
import ApgarScore from "./calculators/ApgarScore.vue";
import EarlyWarningScale from "./calculators/EarlyWarningScale.vue";
import ElectrolyteReplacement from "./calculators/ElectrolyteReplacement.vue";
import ParklandFormula from "./calculators/ParklandFormula.vue";

const { showSnackbar, snackbarText } = useAppClipboard();
const {
	currentPatient,
	hasPatientData,
	patientsList,
	activePatientId,
	addPatient,
	updatePatient,
	deletePatient,
	setActivePatient,
} = usePatient();

const openedGroups = ref(["Calculadoras", "Guias Rápidos"]);
const showDisclaimer = ref(false);
const showPatientDialog = ref(false);
const showDonation = ref(false);
const pixKey = ref(
	"00020126360014br.gov.bcb.pix0114+55719941708545204000053039865802BR5913Alerson Jorge6009Sao Paulo62230519daqr161109448287154630451BA",
); // O usuário pode trocar essa chave depois
const copiedPix = ref(false);

const copyPixKey = () => {
	navigator.clipboard.writeText(pixKey.value);
	copiedPix.value = true;
	setTimeout(() => {
		copiedPix.value = false;
	}, 2000);
};

const editBedId = ref<string | null>(null);

const newBed = ref<PatientProfile>({} as PatientProfile);

const editPatient = (p: PatientProfile) => {
	editBedId.value = p.id;
	newBed.value = p;
};

const cancelEdit = () => {
	editBedId.value = null;
	newBed.value = {} as PatientProfile;
};

const saveNewBed = () => {
	if (!newBed.value.name) return;
	if (editBedId.value) {
		updatePatient(editBedId.value, newBed.value);
	} else {
		addPatient({ ...newBed.value });
	}
	cancelEdit();
};

interface CalculatorItem {
	value: string;
	title: string;
	group: string;
}

interface CalculatorCategory {
	name: string;
	icon: string;
	items: { value: string; title: string }[];
}

const calculatorCategories: CalculatorCategory[] = [
	{
		name: "Alta Vigilância",
		icon: "mdi-alert",
		items: [
			{ value: "mav", title: "MAVs" },
			{ value: "vasoactive", title: "Drogas Vasoativas" },
		],
	},
	{
		name: "Infusões",
		icon: "mdi-water",
		items: [
			{ value: "drip", title: "Gotejamento" },
			{ value: "bic", title: "Bomba de Infusão (BIC)" },
			{ value: "infusiontime", title: "Término de Infusão" },
		],
	},
	{
		name: "Diluições",
		icon: "mdi-needle",
		items: [
			{ value: "rule3", title: "Regra de Três" },
			{ value: "serum", title: "Transformação de Soro" },
			{ value: "penicillin", title: "Diluição de Penicilina" },
			{ value: "electrolytes", title: "Reposição de Eletrólitos" },
		],
	},
	{
		name: "Clínica & Avaliação",
		icon: "mdi-clipboard-pulse",
		items: [
			{ value: "clinical", title: "IMC e Superfície Corporal" },
			{ value: "freewater", title: "Déficit de Água (Sódio)" },
			{ value: "glasgow", title: "Escala de Glasgow" },
			{ value: "braden", title: "Escala de Braden" },
			{ value: "morse", title: "Escala de Morse" },
			{ value: "waterbalance", title: "Balanço Hídrico" },
			{ value: "earlywarning", title: "Escala MEWS" },
			{ value: "insulin", title: "Escala de Insulina" },
		],
	},
	{
		name: "Ginecologia & Obstetrícia",
		icon: "mdi-baby-buggy",
		items: [
			{ value: "gestational", title: "Idade Gestacional e DPP" },
			{ value: "apgar", title: "Índice de APGAR" },
		],
	},
	{
		name: "Emergência & Trauma",
		icon: "mdi-fire",
		items: [{ value: "parkland", title: "Fórmula de Parkland" }],
	},
	{
		name: "Pediatria",
		icon: "mdi-baby-face-outline",
		items: [{ value: "pediatric", title: "Dose por Peso (mg/kg)" }],
	},
	{
		name: "Guias Rápidos",
		icon: "mdi-book-open-variant",
		items: [
			{ value: "catheter", title: "Cateteres Periféricos" },
			{ value: "blood_collection", title: "Ordem de Coleta de Sangue" },
			{ value: "blood_transfusion", title: "Compatibilidade Sanguínea" },
			{ value: "abg", title: "Gasometria Arterial" },
			{ value: "ivfluids", title: "Guia de Soros" },
			{ value: "preop_fasting", title: "Tempo de Jejum" },
			{ value: "acls_rhythms", title: "Ritmos de Parada (ACLS)" },
			{ value: "ysite", title: "Compatibilidade em Y" },
		],
	},
];

const searchQuery = ref(null);
const calculatorsList = computed<CalculatorItem[]>(() => {
	return calculatorCategories.flatMap((cat) =>
		cat.items.map((item) => ({
			value: item.value,
			title: item.title,
			group: cat.name,
		})),
	);
});

const getItemProps = (item: CalculatorItem) => {
	return {
		subtitle: item.group,
	};
};

const searchFilter: FilterFunction = (_value, query, item) => {
	if (!query) return true;
	if (!item) return false;

	const q = query.toLowerCase();
	const rawItem = item.raw as CalculatorItem;

	const t = rawItem.title.toLowerCase();
	const g = rawItem.group.toLowerCase();

	// Custom keywords for search
	const keywordsMap: Record<string, string> = {
		vasoactive: "nora noradrenalina dobuta dobutamina nipride vasoativa",
		drip: "gota macrogota microgota",
		rule3: "regra de tres proporcao",
		clinical: "imc bmi superficie corporal mosteller",
		earlywarning: "mews alerta",
		catheter: "jelco abocath gelco calibre cor",
		abg: "gaso gasometria ph pco2",
		ivfluids: "soro ringer nacl fisiologico",
		freewater: "sodio deficit agua hipernatremia",
	};
	const k = keywordsMap[rawItem.value] ?? "";

	return t.includes(q) || g.includes(q) || k.includes(q);
};

const onSearchSelect = (val: string | null) => {
	if (val) {
		selectTab(val);
		drawer.value = false;
		// Pequeno atraso para não piscar a busca
		setTimeout(() => {
			searchQuery.value = null;
		}, 200);
	}
};

watch(openedGroups, (newVal) => {
	if (newVal.length > 1) {
		openedGroups.value = [newVal[newVal.length - 1]];
	}
});

const theme = useTheme();
const isDark = useLocalStorage("nc-dark-mode", false);

onMounted(() => {
	theme.change(isDark.value ? "dark" : "light");
});

const toggleTheme = () => {
	isDark.value = !isDark.value;
	theme.change(isDark.value ? "dark" : "light");
};
</script>

<style scoped>
/* Reduz o recuo excessivo padrão do Vuetify para os sub-menus */
:deep(.v-list-group__items .v-list-item) {
  padding-inline-start: 1rem;
}

/* Remove ou controla o espaçador nativo do Vuetify entre o ícone e o texto */
:deep(.v-list-item__spacer) {
  width: 0.5rem;
}
</style>

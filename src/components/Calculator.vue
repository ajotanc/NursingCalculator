<template>
  <v-layout class="rounded-0 overflow-hidden" style="height: 100dvh; width: 100vw;">
    <v-app-bar color="primary" class="px-3" elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title @click="selectTab('dashboard')" style="cursor: pointer;">{{ APP_NAME }}</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav density="compact">
        <v-list-subheader class="text-uppercase font-weight-bold text-primary">Início</v-list-subheader>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" :active="activeTab === 'dashboard'" @click="selectTab('dashboard')"></v-list-item>

        <v-list-subheader class="text-uppercase font-weight-bold text-primary mt-2">Alta Vigilância</v-list-subheader>
        <v-list-item prepend-icon="mdi-alert" title="MAVs" :active="activeTab === 'mav'" @click="selectTab('mav')"></v-list-item>
        <v-list-item prepend-icon="mdi-heart-pulse" title="Drogas Vasoativas" :active="activeTab === 'vasoactive'" @click="selectTab('vasoactive')"></v-list-item>
        
        <v-list-subheader class="text-uppercase font-weight-bold text-primary mt-2">Infusões</v-list-subheader>
        <v-list-item prepend-icon="mdi-water" title="Gotejamento" :active="activeTab === 'drip'" @click="selectTab('drip')"></v-list-item>
        <v-list-item prepend-icon="mdi-pump" title="BIC" :active="activeTab === 'bic'" @click="selectTab('bic')"></v-list-item>
        <v-list-item prepend-icon="mdi-clock-outline" title="Término de Infusão" :active="activeTab === 'infusiontime'" @click="selectTab('infusiontime')"></v-list-item>
        
        <v-list-subheader class="text-uppercase font-weight-bold text-primary mt-2">Diluições</v-list-subheader>
        <v-list-item prepend-icon="mdi-calculator" title="Regra de Três" :active="activeTab === 'rule3'" @click="selectTab('rule3')"></v-list-item>
        <v-list-item prepend-icon="mdi-iv-bag" title="Soro" :active="activeTab === 'serum'" @click="selectTab('serum')"></v-list-item>
        <v-list-item prepend-icon="mdi-needle" title="Penicilina" :active="activeTab === 'penicillin'" @click="selectTab('penicillin')"></v-list-item>
        <v-list-item prepend-icon="mdi-test-tube" title="Reposição de Eletrólitos" :active="activeTab === 'electrolytes'" @click="selectTab('electrolytes')"></v-list-item>
        
        <v-list-subheader class="text-uppercase font-weight-bold text-primary mt-2">Hormônios</v-list-subheader>
        <v-list-item prepend-icon="mdi-diabetes" title="Insulina" :active="activeTab === 'insulin'" @click="selectTab('insulin')"></v-list-item>
        <v-list-subheader class="text-uppercase font-weight-bold text-primary mt-2">Clínica & Avaliação</v-list-subheader>
        <v-list-item prepend-icon="mdi-human-handsup" title="IMC e Superfície" :active="activeTab === 'clinical'" @click="selectTab('clinical')"></v-list-item>
        <v-list-item prepend-icon="mdi-eye" title="Escala de Glasgow" :active="activeTab === 'glasgow'" @click="selectTab('glasgow')"></v-list-item>
        <v-list-item prepend-icon="mdi-bed" title="Escala de Braden" :active="activeTab === 'braden'" @click="selectTab('braden')"></v-list-item>
        <v-list-item prepend-icon="mdi-wheelchair-accessibility" title="Escala de Morse" :active="activeTab === 'morse'" @click="selectTab('morse')"></v-list-item>
        <v-list-item prepend-icon="mdi-scale-balance" title="Balanço Hídrico" :active="activeTab === 'waterbalance'" @click="selectTab('waterbalance')"></v-list-item>
        <v-list-item prepend-icon="mdi-alert-octagon" title="Escala MEWS" :active="activeTab === 'earlywarning'" @click="selectTab('earlywarning')"></v-list-item>

        <v-list-subheader class="text-uppercase font-weight-bold text-primary mt-2">Ginecologia & Obstetrícia</v-list-subheader>
        <v-list-item prepend-icon="mdi-baby" title="Idade Gestacional e DPP" :active="activeTab === 'gestational'" @click="selectTab('gestational')"></v-list-item>
        <v-list-item prepend-icon="mdi-baby-buggy" title="Índice de APGAR" :active="activeTab === 'apgar'" @click="selectTab('apgar')"></v-list-item>

        <v-list-subheader class="text-uppercase font-weight-bold text-primary mt-2">Emergência & Trauma</v-list-subheader>
        <v-list-item prepend-icon="mdi-fire" title="Fórmula de Parkland" :active="activeTab === 'parkland'" @click="selectTab('parkland')"></v-list-item>

        <v-list-subheader class="text-uppercase font-weight-bold text-primary mt-2">Pediatria</v-list-subheader>
        <v-list-item prepend-icon="mdi-baby-face-outline" title="Dose por Peso (mg/kg)" :active="activeTab === 'pediatric'" @click="selectTab('pediatric')"></v-list-item>
      </v-list>
    </v-navigation-drawer>

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
import { ref } from "vue";
import BradenScale from "@/components/calculators/BradenScale.vue";
import ClinicalEvaluation from "@/components/calculators/ClinicalEvaluation.vue";
import DosageConverter from "@/components/calculators/DosageConverter.vue";
import DripRate from "@/components/calculators/DripRate.vue";
import GestationalAge from "@/components/calculators/GestationalAge.vue";
import GlasgowScale from "@/components/calculators/GlasgowScale.vue";
import InfusionPump from "@/components/calculators/InfusionPump.vue";
import InfusionTime from "@/components/calculators/InfusionTime.vue";
import InsulinScale from "@/components/calculators/InsulinScale.vue";
import MavProtocols from "@/components/calculators/MavProtocols.vue";
import MorseScale from "@/components/calculators/MorseScale.vue";
import PediatricDose from "@/components/calculators/PediatricDose.vue";
import PenicillinDilution from "@/components/calculators/PenicillinDilution.vue";
import SerumTransformation from "@/components/calculators/SerumTransformation.vue";
import VasoactiveDrugs from "@/components/calculators/VasoactiveDrugs.vue";
import WaterBalance from "@/components/calculators/WaterBalance.vue";
import Dashboard from "@/components/Dashboard.vue";
import { useAppClipboard } from "@/composables/useAppClipboard";
import { activeTab, drawer, selectTab } from "@/composables/useNavigation";
import { APP_NAME } from "@/utils/config";
import ApgarScore from "./calculators/ApgarScore.vue";
import EarlyWarningScale from "./calculators/EarlyWarningScale.vue";
import ElectrolyteReplacement from "./calculators/ElectrolyteReplacement.vue";
import ParklandFormula from "./calculators/ParklandFormula.vue";

const { showSnackbar, snackbarText } = useAppClipboard();
</script>

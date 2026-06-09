<template>
  <v-container fluid class="pa-4 bg-teal-lighten-5 fill-height align-start">
    <v-row>
      <v-col cols="12" md="10" offset-md="1" lg="8" offset-lg="2">
        <v-card elevation="4" class="rounded-xl overflow-hidden">
          <v-toolbar color="teal-darken-2" title="NursingCalculator">
            <template v-slot:prepend>
              <v-icon>mdi-medical-bag</v-icon>
            </template>
          </v-toolbar>

          <v-tabs
            v-model="activeTab"
            bg-color="teal-darken-1"
            color="white"
            show-arrows
            center-active
          >
            <v-tab value="mav"><v-icon start>mdi-alert</v-icon> MAVs</v-tab>
            <v-tab value="drip"><v-icon start>mdi-water</v-icon> Gotejamento</v-tab>
            <v-tab value="bic"><v-icon start>mdi-pump</v-icon> BIC</v-tab>
            <v-tab value="rule3"><v-icon start>mdi-calculator</v-icon> Regra de Três</v-tab>
            <v-tab value="serum"><v-icon start>mdi-iv-bag</v-icon> Soro</v-tab>
            <v-tab value="penicillin"><v-icon start>mdi-needle</v-icon> Penicilina</v-tab>
            <v-tab value="insulin"><v-icon start>mdi-diabetes</v-icon> Insulina</v-tab>
          </v-tabs>

          <v-card-text class="pa-0">
            <v-window v-model="activeTab" :touch="false">
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
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DosageConverter from "@/components/calculators/DosageConverter.vue";
import DripRate from "@/components/calculators/DripRate.vue";
import InfusionPump from "@/components/calculators/InfusionPump.vue";
import InsulinScale from "@/components/calculators/InsulinScale.vue";
import MavProtocols from "@/components/calculators/MavProtocols.vue";
import PenicillinDilution from "@/components/calculators/PenicillinDilution.vue";
import SerumTransformation from "@/components/calculators/SerumTransformation.vue";

const activeTab = ref<string>("mav");
</script>

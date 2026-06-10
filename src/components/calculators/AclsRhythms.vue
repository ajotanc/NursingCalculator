<template>
  <v-container class="pa-4 pa-md-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Ritmos de Parada (ACLS)
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Identificação rápida dos ritmos de Parada Cardiorrespiratória e indicação de choque.
    </div>

    <v-row>
      <!-- Ritmos Chocáveis -->
      <v-col cols="12" md="6">
        <v-card color="red-darken-4" class="h-100 rounded">
          <v-card-item class="bg-white text-red-darken-4 text-center py-3">
            <v-card-title class="d-flex align-center ga-1 text-title-large font-weight-black text-uppercase text-wrap">
              <v-icon icon="mdi-flash"></v-icon> Ritmos Chocáveis
            </v-card-title>
          </v-card-item>
          <v-card-text class="pt-4 text-white">
            <div class="mb-4">
              <h3 class="font-weight-bold text-h6 ma-0">1. Fibrilação Ventricular (FV)</h3>
              <p class="text-body-2 opacity-80 mt-1">
                Atividade elétrica caótica, desorganizada. Sem complexos QRS reconhecíveis. O coração "treme" e não
                bombeia sangue.
              </p>
            </div>
            <v-divider color="white" class="opacity-50 mb-4"></v-divider>
            <div>
              <h3 class="font-weight-bold text-h6 ma-0">2. Taquicardia Ventricular Sem Pulso (TVSP)</h3>
              <p class="text-body-2 opacity-80 mt-1">
                Complexos QRS largos e regulares (monomórfica) ou irregulares (polimórfica). Ausência de pulso central
                palpável.
              </p>
            </div>
          </v-card-text>
          <v-card-actions class="bg-red-darken-3 pa-3 justify-center">
            <strong>Ação: Choque Imediato + RCP</strong>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Ritmos Não Chocáveis -->
      <v-col cols="12" md="6">
        <v-card color="blue-grey-darken-3" class="h-100">
          <v-card-item class="bg-white text-blue-grey-darken-3 text-center py-3">
            <v-card-title class="d-flex align-center ga-1 text-title-large font-weight-black text-uppercase text-wrap">
              <v-icon icon="mdi-flash-off" class="mr-1"></v-icon> Não Chocáveis
            </v-card-title>
          </v-card-item>
          <v-card-text class="pt-4 text-white">
            <div class="mb-4">
              <h3 class="font-weight-bold text-h6 ma-0">1. Assistolia</h3>
              <p class="text-body-2 opacity-80 mt-1">
                Ausência de atividade elétrica ventricular. "Linha reta" no monitor. Checar protocolo CAGAA (Cabos,
                Ganhos, Derivação).
              </p>
            </div>
            <v-divider color="white" class="opacity-50 mb-4"></v-divider>
            <div>
              <h3 class="font-weight-bold text-h6 ma-0">2. Atividade Elétrica Sem Pulso (AESP)</h3>
              <p class="text-body-2 opacity-80 mt-1">
                Qualquer ritmo organizado no monitor (exceto FV/TV), porém SEM pulso central palpável. Procurar e tratar
                causas reversíveis (5Hs e 5Ts).
              </p>
            </div>
          </v-card-text>
          <v-card-actions class="bg-blue-grey-darken-4 pa-3 justify-center">
            <strong>Ação: RCP Imediata + Adrenalina</strong>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-alert type="error" variant="tonal" class="mt-6 text-body-2">
      <strong>Lembrete dos 5H e 5T (Causas reversíveis):</strong>
      <br><strong>5H:</strong> Hipovolemia, Hipóxia, H+ (Acidose), Hipo/Hipercalemia, Hipotermia.
      <br><strong>5T:</strong> Tensão no tórax (Pneumotórax), Tamponamento cardíaco, Toxinas, Trombose Pulmonar,
      Trombose Coronariana.
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
// Guia rápido estático
</script>

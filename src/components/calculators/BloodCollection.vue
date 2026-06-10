<template>
  <v-container class="pa-4 pa-md-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Ordem de Coleta de Sangue
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Ordem correta dos tubos para evitar contaminação por aditivos (Recomendação CLSI).
    </div>

    <v-timeline side="end" density="compact">
      <v-timeline-item v-for="(tubo, index) in tubos" :key="index" :dot-color="tubo.color" size="large">
        <template #icon>
          <span class="text-white font-weight-bold">{{ index + 1 }}</span>
        </template>
        <v-card>
          <v-card-title class="text-subtitle-1 font-weight-bold d-flex align-center text-wrap">
            <v-icon icon="mdi-test-tube" :color="tubo.color" class="mr-2"></v-icon>
            {{ tubo.name }}
          </v-card-title>
          <v-card-text class="pt-2 text-body-2 pb-2">
            <p class="ma-0"><strong>Aditivo:</strong> {{ tubo.additive }}</p>
            <p class="mb-0 text-grey-darken-1">{{ tubo.tests }}</p>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script setup lang="ts">
const tubos = [
	{
		name: "Frasco de Hemocultura",
		color: "grey-darken-3",
		additive: "Meio de cultura",
		tests:
			"Pesquisa de microorganismos (Aeróbios/Anaeróbios). Coletar primeiro para manter esterilidade.",
	},
	{
		name: "Tubo Azul",
		color: "blue",
		additive: "Citrato de Sódio",
		tests: "Provas de coagulação (TAP, PTTa, Fibrinogênio, D-Dímero).",
	},
	{
		name: "Tubo Vermelho ou Amarelo",
		color: "red",
		additive: "Ativador de coágulo (Vermelho) / Com Gel Separador (Amarelo)",
		tests: "Bioquímica, Sorologia, Imunologia, Marcadores Cardíacos.",
	},
	{
		name: "Tubo Verde",
		color: "green",
		additive: "Heparina de Lítio ou Sódio",
		tests: "Bioquímica de urgência, Gasometria Venosa, Amônia, Eletrólitos.",
	},
	{
		name: "Tubo Roxo (ou Lilás)",
		color: "purple",
		additive: "EDTA",
		tests: "Hemograma completo, Tipagem Sanguínea, HbA1c.",
	},
	{
		name: "Tubo Cinza",
		color: "grey",
		additive: "Fluoreto de Sódio + EDTA",
		tests: "Glicemia, Lactato.",
	},
];
</script>

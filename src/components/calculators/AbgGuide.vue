<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Gasometria Arterial
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Valores de referência fundamentais para avaliação do equilíbrio ácido-base e oxigenação.
    </div>

    <v-expansion-panels variant="accordion" class="mb-4">
      <v-expansion-panel v-for="item in abgValues" :key="item.param">
        <v-expansion-panel-title class="font-weight-bold text-primary">
          <v-icon :icon="item.icon" class="mr-2"></v-icon> {{ item.param }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <p class="text-body-2 mt-0"><strong>Valor Normal:</strong> {{ item.range }}</p>
          <p class="text-body-2 mb-0"><strong>Significado:</strong> {{ item.meaning }}</p>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card variant="tonal" color="info" class="pa-2">
      <h4 class="text-subtitle-2 font-weight-bold mb-1"><v-icon icon="mdi-lightbulb-outline" class="mr-1"></v-icon> Dica Rápida</h4>
      <p class="text-body-2 mb-1"><strong>Acidose:</strong> pH &lt; 7.35 | <strong>Alcalose:</strong> pH &gt; 7.45</p>
      <p class="text-body-2 mb-1"><strong>Respiratório:</strong> Alteração principal na pCO2 (Inversamente proporcional ao pH)</p>
      <p class="text-body-2 mb-0"><strong>Metabólico:</strong> Alteração principal no HCO3 (Diretamente proporcional ao pH)</p>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const abgValues = [
	{
		param: "pH",
		icon: "mdi-scale-balance",
		range: "7.35 a 7.45",
		meaning: "Potencial Hidrogeniônico. Define acidemia ou alcalemia.",
	},
	{
		param: "pCO2",
		icon: "mdi-weather-windy",
		range: "35 a 45 mmHg",
		meaning: "Pressão parcial de Dióxido de Carbono. Componente respiratório.",
	},
	{
		param: "HCO3-",
		icon: "mdi-water-outline",
		range: "22 a 26 mEq/L",
		meaning: "Bicarbonato. Componente metabólico (renal).",
	},
	{
		param: "pO2",
		icon: "mdi-molecule",
		range: "80 a 100 mmHg",
		meaning: "Pressão parcial de Oxigênio. Avalia a oxigenação.",
	},
	{
		param: "BE (Base Excess)",
		icon: "mdi-plus-minus",
		range: "-2 a +2 mEq/L",
		meaning: "Excesso de bases. Ajuda a confirmar distúrbios metabólicos.",
	},
	{
		param: "SaO2",
		icon: "mdi-percent",
		range: "95% a 100%",
		meaning: "Saturação arterial de Oxigênio.",
	},
];
</script>

<style scoped>
.calculator-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>

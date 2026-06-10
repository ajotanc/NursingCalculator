<template>
  <v-container class="pa-6">
    <div class="text-h5 text-primary mb-4 font-weight-bold">
      Guia de Soros e Soluções
    </div>
    <div class="text-subtitle-1 text-grey-darken-1 mb-6">
      Guia de Cristaloides e Soluções Intravenosas mais utilizadas na prática clínica.
    </div>

    <v-expansion-panels variant="accordion">
      <v-expansion-panel v-for="fluid in fluids" :key="fluid.name">
        <v-expansion-panel-title class="font-weight-bold text-primary">
          <v-icon :icon="fluid.icon" class="mr-2"></v-icon> {{ fluid.name }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <p class="text-body-2 mt-0"><strong>Tipo:</strong> {{ fluid.type }}</p>
          <p class="text-body-2 mb-2"><strong>Indicação:</strong> {{ fluid.indication }}</p>
          <p class="text-body-2 mb-0 text-red-darken-2"><strong>Precauções:</strong> {{ fluid.precautions }}</p>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script setup lang="ts">
const fluids = [
	{
		name: "Soro Fisiológico (NaCl 0.9%)",
		icon: "mdi-water-outline",
		type: "Cristaloide Isotônico",
		indication:
			"Reposição de volume, hidratação básica, lavagem de acessos e feridas, diluição da maioria dos medicamentos.",
		precautions:
			"Uso excessivo pode causar acidose metabólica hiperclorêmica. Cuidado em pacientes renais ou com insuficiência cardíaca.",
	},
	{
		name: "Ringer Lactato",
		icon: "mdi-water-plus-outline",
		type: "Cristaloide Isotônico",
		indication:
			"Reposição volêmica maciça, traumas, queimados, cirurgias de grande porte. Mais fisiológico que o SF 0.9%.",
		precautions:
			"Contém cálcio: não pode ser administrado na mesma via que sangue (risco de coágulos) ou ceftriaxone. Evitar em insuficiência hepática severa.",
	},
	{
		name: "Soro Glicosado (SG 5%)",
		icon: "mdi-spoon-sugar",
		type: "Isotônico na bolsa (torna-se Hipotônico no corpo)",
		indication:
			"Fornecimento de água livre e calorias, diluição de medicamentos sensíveis a eletrólitos (ex: Amiodarona, Noradrenalina).",
		precautions:
			"Evitar em TCE (Traumatismo Cranioencefálico) e neurointensivo devido ao risco de edema cerebral. Não usar para reposição volêmica em choque.",
	},
	{
		name: "Soro Glicosado (SG 10% ou 50%)",
		icon: "mdi-spoon-sugar",
		type: "Hipertônico",
		indication: "Tratamento de hipoglicemia severa, nutrição parenteral.",
		precautions:
			"Irritante para as veias (flebite). Administrar em acesso central quando possível ou em acesso calibroso.",
	},
	{
		name: "NaCl 3% a 20% (Soro Hipertônico)",
		icon: "mdi-water-alert",
		type: "Cristaloide Hipertônico",
		indication:
			"Edema cerebral, hipertensão intracraniana, hiponatremia severa sintomática.",
		precautions:
			"Risco altíssimo de desmielinização osmótica se corrigido muito rápido. Exige acesso central e monitorização rigorosa na UTI.",
	},
];
</script>

<style scoped>
.calculator-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>

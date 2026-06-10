<template>
	<v-container class="pa-4 pa-md-6">
		<div class="text-h5 text-primary mb-4 font-weight-bold">
			Tempo de Jejum Pré-Operatório
		</div>
		<div class="text-subtitle-1 text-grey-darken-1 mb-6">
			Diretrizes de jejum pré-operatório para evitar broncoaspiração (Baseado na ASA).
		</div>

		<v-card class="rounded">
			<v-list lines="two" class="pa-0">
				<v-list-item v-for="(item, index) in jejum" :key="index" :class="item.bgColor">
					<template #prepend>
						<v-icon :icon="item.icon" :color="item.color" size="x-large" class="mr-4"></v-icon>
					</template>
					<v-list-item-title class="font-weight-bold text-h6 text-wrap">{{ item.title }}</v-list-item-title>
					<v-list-item-subtitle class="text-body-1 mt-1 text-wrap">{{ item.desc }}</v-list-item-subtitle>
					<template #append>
						<div class="text-h5 font-weight-black text-right" :class="`text-${item.color}`">
							{{ item.hours }}h
						</div>
					</template>
				</v-list-item>
			</v-list>
		</v-card>

		<v-alert type="warning" variant="tonal" class="mt-6 text-body-2" icon="mdi-alert">
			<strong>Atenção:</strong> Pacientes com retardo de esvaziamento gástrico (obesidade mórbida, diabetes, gravidez,
			refluxo grave) podem necessitar de tempo de jejum prolongado. Confirme sempre com o anestesista responsável.
		</v-alert>
	</v-container>
</template>

<script setup lang="ts">
const jejum = [
	{
		title: "Líquidos Claros",
		desc: "Água, chá claro, suco sem polpa, café puro sem leite.",
		hours: "2",
		icon: "mdi-cup-water",
		color: "light-blue-darken-2",
		bgColor: "bg-light-blue-lighten-5",
	},
	{
		title: "Leite Materno",
		desc: "Exclusivo para bebês amamentados ao seio.",
		hours: "4",
		icon: "mdi-baby-bottle",
		color: "pink-darken-2",
		bgColor: "bg-pink-lighten-5",
	},
	{
		title: "Fórmula Infantil / Leite Não Humano",
		desc: "Fórmulas, leite de vaca, refeições leves (torrada, chá).",
		hours: "6",
		icon: "mdi-food-apple",
		color: "green-darken-2",
		bgColor: "bg-green-lighten-5",
	},
	{
		title: "Refeição Pesada",
		desc: "Carnes, frituras, alimentos ricos em gordura e proteína.",
		hours: "8",
		icon: "mdi-food-steak",
		color: "brown-darken-2",
		bgColor: "bg-brown-lighten-5",
	},
];
</script>

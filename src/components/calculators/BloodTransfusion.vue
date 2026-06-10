<template>
  <v-container class="pa-4 pa-md-6">
    <div class="text-h5 text-primary mb-2 font-weight-bold">
      Compatibilidade Sanguínea
    </div>
    <div class="text-body-2 text-grey-darken-1 mb-6">
      Clique no paciente ou na bolsa para alterar o tipo sanguíneo.
    </div>

    <!-- Controles Superiores -->
    <v-row dense class="mb-4">
      <v-col cols="12" sm="6">
        <v-select
          v-model="hemoOrPlasma"
          :items="[{title: 'Hemácias', value: 'hemo'}, {title: 'Plasma', value: 'plasma'}]"
          label="Componente"
          variant="outlined"
          density="comfortable"
          hide-details
          color="primary"
          prepend-inner-icon="mdi-water"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="mode"
          :items="[{title: 'Bolsa Doa Para', value: 'donates'}, {title: 'Paciente Recebe De', value: 'receives'}]"
          label="Direção"
          variant="outlined"
          density="comfortable"
          hide-details
          color="primary"
          prepend-inner-icon="mdi-swap-horizontal"
        ></v-select>
      </v-col>
    </v-row>

    <!-- Diagrama Interativo com SVG -->
    <v-card variant="outlined" class="pa-2 pa-md-4 bg-surface text-center overflow-hidden">
      
      <div class="text-caption text-uppercase font-weight-bold text-grey-darken-1 mb-4">
        {{ mode === 'donates' ? 'Quem pode receber do tipo ' + selectedType + '?' : 'Quem pode doar para o tipo ' + selectedType + '?' }}
      </div>

      <div class="diagram-wrapper">
        <!-- SVG Layer for Tubes -->
        <svg viewBox="0 0 400 440" class="diagram-svg">
          <!-- Sombras/Background tubes -->
          <path 
            v-for="node in nodes" 
            :key="'bg-'+node.id" 
            :d="getPath(node)" 
            stroke="#e0e0e0" 
            stroke-width="4" 
            fill="none" 
            class="transition-swing"
          />
          <!-- Active tubes -->
          <path 
            v-for="node in nodes" 
            :key="'fg-'+node.id" 
            :d="getPath(node)" 
            :stroke="hemoOrPlasma === 'hemo' ? '#d32f2f' : '#ffb300'" 
            :stroke-width="isCompatible(node.id) ? 6 : 0" 
            fill="none" 
            stroke-linecap="round"
            class="transition-swing"
            :style="{ opacity: isCompatible(node.id) ? 1 : 0 }"
          />
        </svg>

        <!-- HTML Layer for Elements -->
        
        <!-- Center Bag -->
        <div class="center-bag cursor-pointer" @click="cycleType">
          <div class="blood-bag-ui" :class="hemoOrPlasma === 'hemo' ? 'bg-red-darken-2' : 'bg-amber-darken-3'">
             <div class="bag-loop" :class="hemoOrPlasma === 'hemo' ? 'border-red-darken-2' : 'border-amber-darken-3'"></div>
             <div class="bag-text">{{ selectedType }}</div>
             <div class="bag-nozzle bg-grey-lighten-2"></div>
          </div>
        </div>

        <!-- Person Nodes -->
        <div 
          v-for="node in nodes" 
          :key="node.id" 
          class="node-person cursor-pointer" 
          :style="{left: (node.x / 400 * 100) + '%', top: (node.y / 440 * 100) + '%'}"
          @click="selectedType = node.id"
        >
          <div class="d-flex flex-column align-center transition-swing" :class="isCompatible(node.id) ? 'scale-110' : 'opacity-60'">
            <v-avatar :color="isCompatible(node.id) ? (hemoOrPlasma === 'hemo' ? 'red-lighten-4' : 'amber-lighten-4') : 'transparent'" size="56" class="mb-1">
              <v-icon 
                icon="mdi-human-child" 
                size="44" 
                :color="isCompatible(node.id) ? (hemoOrPlasma === 'hemo' ? 'red-darken-3' : 'amber-darken-4') : 'grey-darken-1'"
              ></v-icon>
            </v-avatar>
            <div class="font-weight-black text-h6" :class="isCompatible(node.id) ? (hemoOrPlasma === 'hemo' ? 'text-red-darken-3' : 'text-amber-darken-4') : 'text-grey-darken-1'" style="line-height: 1;">
              {{ node.id }}
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const hemoOrPlasma = ref<"hemo" | "plasma">("hemo");
const mode = ref<"donates" | "receives">("donates");
const selectedType = ref("O+");

type CompatibilityData = {
	type: string;
	donates: string[];
	receives: string[];
};

const hemoData: Record<string, CompatibilityData> = {
	"O-": {
		type: "O-",
		donates: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
		receives: ["O-"],
	},
	"O+": {
		type: "O+",
		donates: ["O+", "A+", "B+", "AB+"],
		receives: ["O+", "O-"],
	},
	"A-": {
		type: "A-",
		donates: ["A+", "A-", "AB+", "AB-"],
		receives: ["A-", "O-"],
	},
	"A+": {
		type: "A+",
		donates: ["A+", "AB+"],
		receives: ["A+", "A-", "O+", "O-"],
	},
	"B-": {
		type: "B-",
		donates: ["B+", "B-", "AB+", "AB-"],
		receives: ["B-", "O-"],
	},
	"B+": {
		type: "B+",
		donates: ["B+", "AB+"],
		receives: ["B+", "B-", "O+", "O-"],
	},
	"AB-": {
		type: "AB-",
		donates: ["AB+", "AB-"],
		receives: ["A-", "B-", "AB-", "O-"],
	},
	"AB+": {
		type: "AB+",
		donates: ["AB+"],
		receives: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
	},
};

const plasmaData: Record<string, CompatibilityData> = {
	"O-": {
		type: "O-",
		donates: ["O+", "O-"],
		receives: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
	},
	"O+": {
		type: "O+",
		donates: ["O+", "O-"],
		receives: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
	},
	"A-": {
		type: "A-",
		donates: ["A+", "A-", "O+", "O-"],
		receives: ["A+", "A-", "AB+", "AB-"],
	},
	"A+": {
		type: "A+",
		donates: ["A+", "A-", "O+", "O-"],
		receives: ["A+", "A-", "AB+", "AB-"],
	},
	"B-": {
		type: "B-",
		donates: ["B+", "B-", "O+", "O-"],
		receives: ["B+", "B-", "AB+", "AB-"],
	},
	"B+": {
		type: "B+",
		donates: ["B+", "B-", "O+", "O-"],
		receives: ["B+", "B-", "AB+", "AB-"],
	},
	"AB-": {
		type: "AB-",
		donates: ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
		receives: ["AB+", "AB-"],
	},
	"AB+": {
		type: "AB+",
		donates: ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
		receives: ["AB+", "AB-"],
	},
};

const compatibleList = computed(() => {
	const db = hemoOrPlasma.value === "hemo" ? hemoData : plasmaData;
	const current = db[selectedType.value];
	if (!current) return [];
	return mode.value === "donates" ? current.donates : current.receives;
});

const isCompatible = (targetType: string) => {
	return compatibleList.value.includes(targetType);
};

// Layout Nodes
const nodes = [
	{ id: "O+", side: "left", x: 50, y: 50 },
	{ id: "A+", side: "left", x: 50, y: 160 },
	{ id: "B+", side: "left", x: 50, y: 270 },
	{ id: "AB+", side: "left", x: 50, y: 380 },
	{ id: "O-", side: "right", x: 350, y: 50 },
	{ id: "A-", side: "right", x: 350, y: 160 },
	{ id: "B-", side: "right", x: 350, y: 270 },
	{ id: "AB-", side: "right", x: 350, y: 380 },
];

const bloodTypesArray = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];

const cycleType = () => {
	const currentIndex = bloodTypesArray.indexOf(selectedType.value);
	const nextIndex = (currentIndex + 1) % bloodTypesArray.length;
	selectedType.value = bloodTypesArray[nextIndex];
};

// Gera as curvas dos tubos
const getPath = (node: { x: number; y: number; side: string }) => {
	const startX = 200;
	const startY = 215; // Exatamente abaixo do "bico" da bolsa

	// Fim do tubo no ícone do paciente
	const endX = node.side === "left" ? node.x + 25 : node.x - 25;
	const endY = node.y;

	// O tubo desce reto a partir da bolsa um pouquinho
	const cp1X = 200;
	const cp1Y = 235;

	// Depois faz a curva para a lateral formando um "fountain"
	const cp2X = node.side === "left" ? 140 : 260;
	const cp2Y = endY < 215 ? endY + 50 : endY - 20;

	return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
};
</script>

<style scoped>
.diagram-wrapper {
	position: relative;
	width: 100%;
	max-width: 450px;
	margin: 0 auto;
	aspect-ratio: 400 / 440;
}

.diagram-svg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
}

.center-bag {
	position: absolute;
	left: 50%;
	top: 35%; /* Ligeiramente acima do centro para dar espaço aos tubos */
	transform: translate(-50%, -50%);
	z-index: 10;
}

/* UI Personalizada da Bolsa para imitar a imagem */
.blood-bag-ui {
	position: relative;
	width: 90px;
	height: 120px;
	border-radius: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4px 12px rgba(0,0,0,0.3);
	border: 3px solid rgba(255,255,255,0.4);
	transition: background-color 0.3s;
}

.bag-loop {
	position: absolute;
	top: -14px;
	width: 32px;
	height: 24px;
	border: 4px solid;
	border-radius: 12px;
	z-index: -1;
}

.bag-text {
	font-size: 2rem;
	font-weight: 900;
	color: white;
	line-height: 1;
	text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.bag-nozzle {
	position: absolute;
	bottom: -10px;
	width: 20px;
	height: 14px;
	border-radius: 4px;
	z-index: 15;
	border: 2px solid rgba(0,0,0,0.1);
}

.node-person {
	position: absolute;
	transform: translate(-50%, -50%);
	z-index: 5;
}

.scale-110 {
	transform: scale(1.1);
}

.opacity-60 {
	opacity: 0.6;
}

.cursor-pointer {
	cursor: pointer;
}
</style>

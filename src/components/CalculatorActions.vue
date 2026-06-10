<template>
  <div class="mt-6 d-flex justify-space-between align-center">
    <v-btn color="grey-darken-1" variant="text" @click="handleReset">
      Limpar
    </v-btn>
    <v-btn color="primary" variant="tonal" prepend-icon="mdi-clipboard-text" @click="handleCopy">
      Copiar
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { useHaptics } from "@/composables/useHaptics";

const emit = defineEmits(["reset", "copy"]);
const { vibrate, vibrateSuccess } = useHaptics();

const handleReset = () => {
	vibrate();
	emit("reset");
};

const handleCopy = () => {
	vibrateSuccess();
	emit("copy");

	setTimeout(() => {
		emit("reset");
	}, 200);
};
</script>

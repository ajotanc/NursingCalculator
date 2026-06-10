<template>
  <div class="mt-6 d-flex justify-space-between align-center">
    <v-btn color="grey-darken-1" variant="text" @click="$emit('reset')">
      Limpar
    </v-btn>
    <v-btn color="primary" variant="tonal" prepend-icon="mdi-clipboard-text" @click="handleCopy">
      Copiar
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["reset", "copy"]);

const handleCopy = () => {
	emit("copy");

	setTimeout(() => {
		emit("reset");
	}, 200);
};
</script>

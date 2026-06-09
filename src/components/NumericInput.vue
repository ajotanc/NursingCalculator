<template>
  <v-text-field
    type="number"
    inputmode="decimal"
    @keypress="onKeypress"
    v-bind="$attrs"
  >
    <template #append-inner v-if="suffix">
      <span class="align-self-center text-grey text-center" style="min-width: 48px; display: inline-block;">
        {{ suffix }}
      </span>
    </template>

    <!-- Repassa todos os slots recebidos para o v-text-field -->
    <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
      <slot :name="name" v-bind="slotData || {}"></slot>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
defineOptions({
	inheritAttrs: false,
});

defineProps<{
	suffix?: string;
}>();

const onKeypress = (e: KeyboardEvent) => {
	if (!/^[0-9.,]+$/.test(e.key)) {
		e.preventDefault();
	}
};
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
:deep(input[type="number"]::-webkit-outer-spin-button),
:deep(input[type="number"]::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

/* Firefox */
:deep(input[type="number"]) {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>

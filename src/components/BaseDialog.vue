<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" :max-width="maxWidth">
    <v-card>
      <v-card-title v-if="title" class="text-h6 font-weight-bold bg-primary text-white pa-4 d-flex align-center ga-2">
        <v-icon v-if="icon" :icon="icon" size="small" class="mr-1"></v-icon>
        {{ title }}
        <v-spacer></v-spacer>
        <slot name="title-append"></slot>
        <v-btn v-if="showClose" icon="mdi-close" variant="text" density="comfortable" @click="$emit('update:modelValue', false)"></v-btn>
      </v-card-title>
      
      <slot></slot>

      <v-card-actions v-if="$slots.actions" class="pa-4 pt-0 justify-end">
        <slot name="actions"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		modelValue: boolean;
		title?: string;
		icon?: string;
		maxWidth?: number | string;
		showClose?: boolean;
	}>(),
	{
		maxWidth: 500,
		showClose: false,
	},
);

defineEmits(["update:modelValue"]);
</script>

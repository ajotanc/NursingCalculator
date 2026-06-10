<template>
  <div class="ad-banner-container rounded overflow-hidden mx-2 my-2">
    <!-- Placeholder visível enquanto não temos o código oficial do AdSense -->
    <v-card 
      v-if="!adLoaded"
      variant="tonal" 
      color="primary" 
      class="d-flex flex-column align-center justify-center text-center pa-4"
      min-height="100"
      elevation="0"
    >
      <v-icon icon="mdi-advertisements" size="large" class="mb-2 opacity-70"></v-icon>
      <div class="text-caption font-weight-bold text-uppercase opacity-70">
        Espaço Patrocinado
      </div>
      <div class="text-caption opacity-70 mt-1" style="font-size: 10px; line-height: 1.2;">
        Anuncie seu curso ou loja aqui!
      </div>
    </v-card>

    <!-- Google AdSense tag (fica escondido até termos client e slotId reais) -->
    <div v-show="client && slotId" class="ad-wrapper">
      <ins
        class="adsbygoogle"
        style="display:block"
        :data-ad-client="client"
        :data-ad-slot="slotId"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';

const props = defineProps<{
  client?: string;
  slotId?: string;
}>();

const adLoaded = ref(false);

onMounted(() => {
  if (props.client && props.slotId) {
    nextTick(() => {
      try {
        // @ts-expect-error - adsbygoogle is injected by google script
        window.adsbygoogle = window.adsbygoogle || [];
        // @ts-expect-error
        window.adsbygoogle.push({});
        adLoaded.value = true;
      } catch (e) {
        console.error('AdSense initialization error:', e);
      }
    });
  }
});
</script>

<style scoped>
.ad-banner-container {
  width: auto;
  position: relative;
  border: 1px dashed rgba(var(--v-theme-primary), 0.3);
  background: rgba(var(--v-theme-primary), 0.03);
}
</style>

<template>
  <v-app>
    <transition name="fade">
      <SplashScreen v-if="showSplash" />
    </transition>

    <v-main>
      <Calculator />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Calculator from "@/components/Calculator.vue";
import SplashScreen from "@/components/SplashScreen.vue";

const showSplash = ref(true);

onMounted(() => {
	setTimeout(() => {
		showSplash.value = false;
	}, 2000); // 2 segundos de exibição da splash screen
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

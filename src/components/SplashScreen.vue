<template>
  <div class="splash-screen d-flex flex-column align-center justify-center bg-primary-darken-2">
    <div class="splash-content text-center">
      <v-icon
        icon="mdi-heart-pulse"
        color="white"
        size="80"
        class="heartbeat-animation"
      ></v-icon>
      
      <h1 class="text-h3 font-weight-black text-white mb-2">
        {{appName[0]}}<span class="text-cyan-lighten-2">{{appName[1]}}</span>
      </h1>
      
      <div class="text-subtitle-1 text-white opacity-70">
        Apoio Clínico e Segurança
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { APP_NAME } from "@/utils/config";

const appName = APP_NAME.split(" ");
</script>

<style scoped>
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: linear-gradient(135deg, #0d47a1 0%, #00838f 100%);
}

.heartbeat-animation {
  animation: heartbeat 1.5s ease-in-out infinite both;
}

@keyframes heartbeat {
  from {
    transform: scale(1);
    transform-origin: center center;
    animation-timing-function: ease-out;
  }
  10% {
    transform: scale(0.91);
    animation-timing-function: ease-in;
  }
  17% {
    transform: scale(0.98);
    animation-timing-function: ease-out;
  }
  33% {
    transform: scale(0.87);
    animation-timing-function: ease-in;
  }
  45% {
    transform: scale(1);
    animation-timing-function: ease-out;
  }
}
</style>

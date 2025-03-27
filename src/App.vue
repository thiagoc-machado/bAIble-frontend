<template>
  <v-app :theme="theme">
    <v-main class="main-container">
      <v-container fluid class="pa-0">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue'

const theme = ref('light')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.value = savedTheme
  } else {
    // Verifica se o sistema está em modo escuro
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.value = prefersDark ? 'dark' : 'light'
  }
})

// Fornece a função toggleTheme para componentes filhos
provide('toggleTheme', toggleTheme)
</script>

<style>
:root {
  --app-max-width: 1200px;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background-color: var(--v-theme-background);
}

#app {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background-color: var(--v-theme-background);
}

.v-application {
  height: 100vh;
  width: 100vw;
  margin: 0 !important;
  padding: 0 !important;
  background-color: var(--v-theme-background);
}

.v-application__wrap {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  padding: 0 !important;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--v-theme-background);
}

.main-container {
  background-color: var(--v-theme-background);
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 !important;
}

.container {
  max-width: var(--app-max-width);
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
}

@media (max-width: 600px) {
  #app, .v-application, .v-application__wrap {
    height: 100dvh;
    width: 100vw;
    max-width: 100vw;
    margin: 0 !important;
    padding: 0 !important;
  }

  .container {
    padding: 0;
    margin: 0;
    max-width: 100%;
  }

  /* Remove bordas e margens do Vuetify em mobile */
  .v-container,
  .v-col,
  .v-row {
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Garante que cards e outros elementos ocupem toda a largura */
  .v-card {
    width: 100% !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }
}
</style>

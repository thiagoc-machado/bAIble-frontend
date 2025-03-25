<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
// Componente raiz da aplicação
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
}

#app {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.v-application {
  height: 100vh;
  width: 100vw;
  margin: 0 !important;
  padding: 0 !important;
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
}

.container {
  max-width: var(--app-max-width);
  margin: 0 auto;
  padding: 0 1rem;
}
html, body {
  overflow-x: hidden;
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

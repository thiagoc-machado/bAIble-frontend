<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="pa-6">
            <v-btn icon="mdi-arrow-left" @click="goBack" variant="text" />
          <h1 class="text-h4 mb-6">{{ $t('terms.title') }}</h1>
          
          <div class="text-body-1">
            <p class="mb-4">{{ $t('terms.lastUpdated') }}</p>
            
            <h2 class="text-h6 mb-3">{{ $t('terms.acceptance.title') }}</h2>
            <p class="mb-4">{{ $t('terms.acceptance.content') }}</p>
            
            <h2 class="text-h6 mb-3">{{ $t('terms.usage.title') }}</h2>
            <p class="mb-4">{{ $t('terms.usage.content') }}</p>
            
            <h2 class="text-h6 mb-3">{{ $t('terms.aiDisclaimer.title') }}</h2>
            <p class="mb-4">{{ $t('terms.aiDisclaimer.content') }}</p>
            
            <h2 class="text-h6 mb-3">{{ $t('terms.intellectual.title') }}</h2>
            <p class="mb-4">{{ $t('terms.intellectual.content') }}</p>
            
            <h2 class="text-h6 mb-3">{{ $t('terms.liability.title') }}</h2>
            <p class="mb-4">{{ $t('terms.liability.content') }}</p>
            
            <h2 class="text-h6 mb-3">{{ $t('terms.changes.title') }}</h2>
            <p class="mb-4">{{ $t('terms.changes.content') }}</p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goBack = () => {
  router.push('/')
}
// Componente de Termos de Uso
</script> 
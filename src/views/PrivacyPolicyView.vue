<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="pa-6">
            <v-btn icon="mdi-arrow-left" @click="goBack" variant="text" />
          <h1 class="text-h4 mb-6">{{ $t('privacy.title') }}</h1>
          
          <div class="text-body-1">
            <p class="mb-4">{{ $t('privacy.lastUpdated') }}</p>
            
            <h2 class="text-h6 mb-3">{{ $t('privacy.dataCollection.title') }}</h2>
            <p class="mb-4">{{ $t('privacy.dataCollection.content') }}</p>
            
            <h2 class="text-h6 mb-3">{{ $t('privacy.cookies.title') }}</h2>
            <p class="mb-4">{{ $t('privacy.cookies.content') }}</p>
            
            <h2 class="text-h6 mb-3">{{ $t('privacy.thirdParty.title') }}</h2>
            <p class="mb-4">{{ $t('privacy.thirdParty.content') }}</p>
            
            <h2 class="text-h6 mb-3">{{ $t('privacy.ads.title') }}</h2>
            <p class="mb-4">{{ $t('privacy.ads.content') }}</p>
            
            <h2 class="text-h6 mb-3">{{ $t('privacy.contact.title') }}</h2>
            <p class="mb-4">{{ $t('privacy.contact.content') }}</p>
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
// Componente de Política de Privacidade
</script> 
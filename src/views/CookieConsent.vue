<template>
  <v-snackbar v-model="visible" timeout="-1" color="primary" location="bottom" elevation="10">
    {{ t('cookies.message') }}
    <template #actions>
      <v-btn color="white" @click="acceptCookies">
        {{ t('cookies.accept') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const visible = ref(false)
const { t } = useI18n()

onMounted(() => {
  const consent = localStorage.getItem('cookieConsent')
  if (!consent) {
    visible.value = true
  }
})

const acceptCookies = () => {
  localStorage.setItem('cookieConsent', 'accepted')
  visible.value = false
}
</script>

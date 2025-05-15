<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6">
          <v-btn icon="mdi-arrow-left" @click="goBack" variant="text" />
          <h1 class="text-h4 mb-6">{{ $t('contact.title') }}</h1>
          <p class="text-body-1 mb-6">{{ $t('contact.description') }}</p>

          <v-form ref="formRef" v-model="valid" @submit.prevent="submitForm">
            <v-text-field
              v-model="name"
              :label="$t('contact.form.name')"
              :rules="nameRules"
              required
              class="mb-4"
              name="name"
            />

            <v-text-field
              v-model="email"
              :label="$t('contact.form.email')"
              :rules="emailRules"
              required
              class="mb-4"
              name="email"
            />

            <v-text-field
              v-model="subject"
              :label="$t('contact.form.subject')"
              :rules="subjectRules"
              required
              class="mb-4"
              name="subject"
            />

            <v-textarea
              v-model="message"
              :label="$t('contact.form.message')"
              :rules="messageRules"
              required
              rows="4"
              class="mb-4"
              name="message"
            />

            <v-btn
              color="primary"
              type="submit"
              :loading="loading"
              :disabled="!valid"
              block
            >
              {{ $t('contact.form.submit') }}
            </v-btn>
          </v-form>

          <v-divider class="my-6" />

          <div class="mt-6">
            <h2 class="text-h6 mb-3">{{ $t('contact.info.title') }}</h2>
            <p class="text-body-1">
              {{ $t('contact.info.content', { email: 'thiagocmach@gmail.com' }) }}
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import emailjs from '@emailjs/browser'

const { t } = useI18n()
const router = useRouter()

const formRef = ref(null)
const valid = ref(false)
const loading = ref(false)

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')

const nameRules = [
  v => !!v || t('contact.validation.nameRequired'),
  v => v.length >= 2 || t('contact.validation.nameMin')
]

const emailRules = [
  v => !!v || t('contact.validation.emailRequired'),
  v => /.+@.+\..+/.test(v) || t('contact.validation.emailValid')
]

const subjectRules = [
  v => !!v || t('contact.validation.subjectRequired'),
  v => v.length >= 3 || t('contact.validation.subjectMin')
]

const messageRules = [
  v => !!v || t('contact.validation.messageRequired'),
  v => v.length >= 10 || t('contact.validation.messageMin')
]

const submitForm = async () => {
  if (!formRef.value.validate()) return

  loading.value = true

  try {
    await emailjs.send(
      'service_ey4oxzo',
      'template_xbuhk1b',
      {
        name: name.value,
        email: email.value,
        subject: subject.value,
        message: message.value
      },
      '3PaqMmy4pZ6WPjmFa'
    )

    alert(t('contact.success'))
    name.value = ''
    email.value = ''
    subject.value = ''
    message.value = ''
    formRef.value.reset()
  } catch (error) {
    console.error('Erro ao enviar:', error)
    alert(t('contact.error'))
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/')
}
</script>

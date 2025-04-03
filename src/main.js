import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import pt from './locales/pt.json'
import en from './locales/en.json'
import es from './locales/es.json'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'pt',
  fallbackLocale: 'pt',
  messages: {
    pt,
    en,
    es
  }
})

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(i18n)

app.mount('#app')

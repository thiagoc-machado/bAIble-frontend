<template>
  <div class="chat-container">
    <!-- Header -->
    <v-app-bar
      :theme="theme"
      class="chat-header"
      elevation="1"
      density="comfortable"
      color="surface"
    >
      <div class="header-content">
        <v-btn icon="mdi-arrow-left" @click="goBack" variant="text" />
        <v-avatar class="mx-4" :color="getAvatarColor" size="40">
          {{ characterInitials }}
        </v-avatar>
        <v-app-bar-title class="text-h6">{{ characterName }}</v-app-bar-title>
        <v-btn icon="mdi-brightness-6" @click="toggleTheme" variant="text" />
      </div>
    </v-app-bar>

    <!-- Messages -->
    <main class="chat-main">
      <div class="messages-container" ref="messagesContainer">
        <div class="messages-content">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="message-wrapper"
            :class="{ 'message-user': message.isUser }"
          >
            <v-card
              :theme="theme"
              :class="[
                'message-bubble',
                message.isUser ? 'user-bubble' : 'character-bubble'
              ]"
              elevation="2"
            >
              <v-card-text class="pa-3">
                {{ message.text }}
                <span class="message-time">{{ message.time }}</span>
              </v-card-text>
            </v-card>
          </div>

          <v-fade-transition>
            <div v-if="loading" class="typing-indicator">
              <v-progress-circular
                indeterminate
                color="primary"
                size="24"
                class="mr-2"
              />
              <span>{{ t('chat.typing', { name: characterName }) }}</span>
            </div>
          </v-fade-transition>
        </div>
      </div>
    </main>

    <!-- Input -->
    <footer class="chat-footer" :theme="theme">
      <div class="input-content">
        <v-form @submit.prevent="sendMessage" class="d-flex align-center">
          <v-text-field
            v-model="newMessage"
            :placeholder="t('chat.messagePlaceholder')"
            variant="outlined"
            :theme="theme"
            bg-color="surface"
            hide-details
            class="mr-2"
            density="comfortable"
            @keyup.enter="sendMessage"
          >
            <template v-slot:append-inner>
              <v-btn
                icon="mdi-send"
                color="primary"
                variant="text"
                :disabled="!newMessage.trim() || loading"
                @click="sendMessage"
                size="large"
              />
            </template>
          </v-text-field>
        </v-form>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { characters } from '@/data/characters'
import chatService from '@/services/chatService'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const toggleTheme = inject('toggleTheme')
const theme = ref('light')
const newMessage = ref('')
const messagesContainer = ref(null)
const messages = ref([])
const loading = ref(false)

const characterId = computed(() => route.params.characterId)
const character = computed(() => 
  characters.find(c => c.id === characterId.value)
)

const characterName = computed(() => t(character.value?.nameKey || '') || '')
const characterInitials = computed(() => {
  return characterName.value
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const getAvatarColor = computed(() => {
  const colors = ['primary', 'secondary', 'success', 'info', 'warning']
  const hash = characterName.value.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  return colors[Math.abs(hash) % colors.length]
})

const goBack = () => {
  router.push('/')
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = () => {
  const now = new Date()
  return now.toLocaleTimeString('pt-BR', { 
    hour: '2-digit',
    minute: '2-digit'
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || loading.value) return

  const userMessage = {
    text: newMessage.value,
    isUser: true,
    time: formatTime()
  }
  
  messages.value.push(userMessage)
  const messageText = newMessage.value
  newMessage.value = ''
  await scrollToBottom()

  loading.value = true
  
  try {
    const response = await chatService.sendMessage({
      message: messageText,
      characterId: characterId.value,
      version: route.query.version || 'NVI',
      language: locale.value
    })

    messages.value.push({
      text: response.message,
      isUser: false,
      time: formatTime()
    })

    await scrollToBottom()
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    messages.value.push({
      text: t('chat.errorMessage'),
      isUser: false,
      time: formatTime()
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!characterId.value) {
    router.push('/')
    return
  }
  scrollToBottom()
})
</script>

<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--v-theme-background);
}

.chat-header {
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 1rem;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
  width: 100%;
}

.messages-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.message-wrapper {
  display: flex;
  margin-bottom: 1rem;
  animation: fadeIn 0.3s ease;
  width: 100%;
}

.message-user {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 80%;
  border-radius: 1.5rem;
  position: relative;
  word-break: break-word;
}

.user-bubble {
  background-color: var(--v-theme-primary);
  color: black;
  border-bottom-right-radius: 0.5rem;
}

.character-bubble {
  background-color: var(--v-theme-surface-variant);
  border-bottom-left-radius: 0.5rem;
}

.message-time {
  float: right;
  font-size: 0.75rem;
  margin-left: 0.5rem;
  margin-top: 0.25rem;
  opacity: 0.7;
}

.chat-footer {
  position: sticky;
  bottom: 0;
  width: 100%;
  background-color: var(--v-theme-surface);
  border-top: 1px solid var(--v-border-color);
  padding: 0.5rem 0;
}

.input-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.typing-indicator {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  color: var(--v-theme-on-surface-variant);
  font-size: 0.875rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 600px) {
  .message-bubble {
    max-width: 90%;
  }

  .chat-container {
    height: 100dvh;
  }

  .header-content,
  .messages-content,
  .input-content {
    padding: 0 0.5rem;
  }
}
</style> 
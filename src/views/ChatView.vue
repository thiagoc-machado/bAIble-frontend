<template>
  <div class="chat-container">
    <!-- Header -->
    <v-app-bar
      class="chat-header"
      elevation="1"
      density="comfortable"
      color="surface"
    >
      <div class="header-content">
        <v-btn icon="mdi-arrow-left" @click="goBack" variant="text" />
        <v-avatar class="mx-4" size="40">
          <v-img
            :src="characterAvatar"
            :alt="characterName"
            @error="e => e.target.src = '/images/characters/avatar-neutro.png'"
          >
            <template v-slot:error>
              <v-img
                src="/images/characters/avatar-neutro.png"
                :alt="characterName"
              />
            </template>
          </v-img>
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
              <span>{{ characterName + ' ' + t('chat.typing') }}</span>
            </div>
          </v-fade-transition>
        </div>
      </div>
    </main>

    <!-- Input -->
    <footer class="chat-footer">
      <div class="input-content">
        <v-form @submit.prevent="sendMessage" class="d-flex align-center">
          <v-text-field
            v-model="newMessage"
            :placeholder="t('chat.messagePlaceholder')"
            variant="outlined"
            bg-color="surface"
            hide-details
            class="mr-2 message-input"
            density="comfortable"
            @keyup.enter="handleEnter"
            @focus="scrollToBottom"
          >
            <template v-slot:append-inner>
              <v-btn
                icon="mdi-send"
                color="primary"
                variant="text"
                :disabled="!newMessage.trim() || loading"
                @click="handleSend"
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

// Computed property para o avatar com fallback
const characterAvatar = computed(() => {
  if (!characterId.value) return null
  return `/images/characters/${characterId.value}.png`
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

const scrollToBottom = async (smooth = true) => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    })
  }
}

const formatTime = () => {
  const now = new Date()
  return now.toLocaleTimeString('pt-BR', { 
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleEnter = (event) => {
  event.preventDefault()
  if (event.key === 'Enter' && !event.shiftKey) {
    sendMessage()
    // Esconde o teclado em dispositivos móveis
    document.activeElement.blur()
  }
}

const handleSend = () => {
  sendMessage()
  // Esconde o teclado em dispositivos móveis
  document.activeElement.blur()
  // Força o scroll para baixo após enviar
  nextTick(() => {
    scrollToBottom(false)
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || loading.value) return

  const userMessage = {
    text: newMessage.value,
    isUser: true,
    time: formatTime(),
    timestamp: new Date()
  }
  
  messages.value.push(userMessage)
  const messageText = newMessage.value
  newMessage.value = ''
  
  // Força o scroll para baixo após adicionar a mensagem do usuário
  await nextTick()
  scrollToBottom(false)
  
  loading.value = true
  
  try {
    const response = await chatService.sendMessage({
      message: messageText,
      characterId: characterId.value,
      version: route.query.version || 'NVI',
      language: locale.value,
      model: 'mistral-7b-instruct',
      history: messages.value.slice(0, -1).map(msg => ({
        text: msg.text,
        isUser: msg.isUser,
        timestamp: msg.timestamp.toISOString()
      }))
    })

    messages.value.push({
      text: response.message,
      isUser: false,
      time: formatTime(),
      timestamp: new Date()
    })

    // Força o scroll para baixo após receber a resposta
    await nextTick()
    scrollToBottom(false)
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    messages.value.push({
      text: t('chat.errorMessage'),
      isUser: false,
      time: formatTime(),
      timestamp: new Date()
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

  // Ajusta o viewport em dispositivos móveis
  if ('visualViewport' in window) {
    const updateViewport = () => {
      const viewport = window.visualViewport
      const height = viewport.height
      const offsetTop = viewport.offsetTop
      
      // Ajusta a altura do container principal
      document.documentElement.style.height = `${height}px`
      
      // Ajusta a altura do container de mensagens
      if (messagesContainer.value) {
        const headerHeight = document.querySelector('.chat-header')?.offsetHeight || 0
        const footerHeight = document.querySelector('.chat-footer')?.offsetHeight || 0
        const availableHeight = height - headerHeight - footerHeight
        
        messagesContainer.value.style.height = `${availableHeight}px`
      }
      
      // Força o scroll para baixo
      scrollToBottom(false)
    }

    // Atualiza quando o viewport muda (teclado aparece/desaparece)
    window.visualViewport.addEventListener('resize', updateViewport)
    window.visualViewport.addEventListener('scroll', updateViewport)
    
    // Atualiza inicialmente
    updateViewport()
  }

  // Força o scroll para baixo inicial
  nextTick(() => {
    scrollToBottom(false)
  })
})
</script>

<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: rgb(var(--v-theme-background));
}

.chat-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.12);
  box-shadow: 0 2px 12px rgba(var(--v-theme-primary), 0.08);
}

.header-content {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  color: rgb(var(--v-theme-on-surface));
}

.character-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(
    to bottom,
    rgba(var(--v-theme-surface), 0.95),
    rgba(var(--v-theme-background), 0.95)
  );
  padding-top: 64px; /* Altura da barra superior */
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
  width: 100%;
  scroll-behavior: smooth;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.05),
    rgba(var(--v-theme-surface-variant), 0.1)
  );
}

.messages-content {
  width: 100%;
  max-width: 800px;
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
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.08);
  transition: all 0.2s ease;
}

.message-bubble:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.12);
}

.user-bubble {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgba(var(--v-theme-primary), 0.9));
  color: white;
  border-bottom-right-radius: 0.5rem;
}

.character-bubble {
  background-color: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  border-bottom-left-radius: 0.5rem;
  border: 1px solid rgba(var(--v-theme-primary), 0.15);
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
  background-color: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(var(--v-theme-primary), 0.12);
  padding: 0.75rem 0;
  box-shadow: 0 -2px 12px rgba(var(--v-theme-primary), 0.08);
}

.input-content {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.message-input {
  :deep(.v-field) {
    border-radius: 24px;
    background-color: rgb(var(--v-theme-background));
    border: 1px solid rgba(var(--v-theme-primary), 0.2);
    transition: all 0.2s ease;
  }

  :deep(.v-field:hover) {
    border-color: rgba(var(--v-theme-primary), 0.4);
    background-color: rgb(var(--v-theme-background));
  }

  :deep(.v-field--focused) {
    background-color: rgb(var(--v-theme-background)) !important;
    border-color: rgb(var(--v-theme-primary));
    box-shadow: 0 0 0 1px rgba(var(--v-theme-primary), 0.2),
                0 4px 12px rgba(var(--v-theme-primary), 0.1);
  }

  :deep(.v-field__outline) {
    --v-field-border-opacity: 0;
  }

  :deep(.v-field__input) {
    min-height: 48px !important;
    padding: 12px 16px !important;
    color: rgb(var(--v-theme-on-surface));
    font-size: 1rem;
  }

  :deep(.v-field__append-inner) {
    padding-inline-end: 8px;
  }

  :deep(.v-btn) {
    margin-right: -8px;
    transition: transform 0.2s ease;
  }

  :deep(.v-btn:hover) {
    transform: scale(1.1);
  }
}

.typing-indicator {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  margin: 0.5rem;
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: 0.875rem;
  animation: fadeIn 0.3s ease;
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.05);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 600px) {
  .chat-container {
    height: 100dvh;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }

  .header-content,
  .messages-content,
  .input-content {
    padding: 0 0.75rem;
  }

  .message-bubble {
    max-width: 90%;
  }

  .chat-footer {
    padding: 0.75rem;
    background-color: rgb(var(--v-theme-surface));
    position: sticky;
    bottom: 0;
    z-index: 10;
  }

  .message-input {
    margin-right: 0 !important;

    :deep(.v-field) {
      border-radius: 20px;
    }

    :deep(.v-field__input) {
      min-height: 44px !important;
      padding: 10px 14px !important;
    }
  }

  .messages-container {
    height: calc(100dvh - 120px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  /* Previne o scroll da página quando o teclado está aberto */
  body {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .chat-main {
    padding-top: 56px; /* Altura menor da barra superior em dispositivos móveis */
  }
}

/* Ajustes específicos para quando o teclado está aberto */
@media (max-width: 600px) and (max-height: 400px) {
  .messages-container {
    height: calc(100dvh - 100px);
  }
}
</style> 
<template>
  <v-container class="fill-height pa-0" fluid>
    <v-row justify="center" align="center" no-gutters style="min-height: 100vh;">
      <v-col cols="12">
        <div class="app-header text-center">
          <v-icon icon="mdi-book-cross" size="64" color="primary" class="mb-4" />
          <h1 class="text-h3 font-weight-bold mb-2 text-black">{{ $t('home.title') }}</h1>
          <div class="text-subtitle-1 text-medium-emphasis">{{ $t('home.subtitle') }}</div>
        </div>

        <div class="content-wrapper">
          <v-card
            class="mx-auto chat-card"
            :theme="theme"
            elevation="8"
            rounded="lg"
          >
            <v-card-text class="pa-6">
              <v-autocomplete
                v-model="selectedCharacter"
                :items="characters"
                :item-title="(item) => t(item.nameKey)"
                item-value="id"
                :label="$t('home.selectCharacter')"
                variant="outlined"
                class="mb-4"
                prepend-inner-icon="mdi-account-search"
                clearable
                :hide-details="!selectedCharacter"
              >
                <template v-slot:prepend>
                  <v-avatar
                    :color="getCharacterColor"
                    :image="selectedCharacter ? undefined : null"
                    class="mr-2"
                  >
                    {{ getCharacterInitials }}
                  </v-avatar>
                </template>
              </v-autocomplete>

              <v-expand-transition>
                <div v-if="selectedCharacter || showAdvancedOptions">
                  <v-autocomplete
                    v-model="selectedVersion"
                    :items="versions"
                    item-title="name"
                    item-value="id"
                    :label="$t('home.bibleVersion')"
                    variant="outlined"
                    class="mb-4"
                    prepend-inner-icon="mdi-book-open-variant"
                    hide-details
                  />

                  <v-autocomplete
                    v-if="isDevelopment"
                    v-model="selectedModel"
                    :items="models"
                    item-title="name"
                    item-value="id"
                    :label="$t('home.aiModel')"
                    variant="outlined"
                    class="mb-4"
                    prepend-inner-icon="mdi-brain"
                    hide-details
                  />
                </div>
              </v-expand-transition>

              <v-btn
                block
                :color="selectedCharacter ? 'primary' : 'secondary'"
                size="x-large"
                class="mt-6 mb-8 chat-button"
                elevation="2"
                @click="startChat"
                min-height="56"
              >
                <v-icon start icon="mdi-message-text" class="mr-2" />
                <span class="button-text">{{ chatButtonText }}</span>
              </v-btn>

              <v-divider class="mb-6" />

              <div class="text-h6 mb-4 d-flex align-center">
                <v-icon icon="mdi-star" color="warning" class="mr-2" />
                {{ $t('home.popularCharacters') }}
              </div>

              <div class="characters-grid">
                <v-btn
                  v-for="character in popularCharacters"
                  :key="character.id"
                  :color="getRandomColor(character.id)"
                  class="character-button"
                  elevation="2"
                  rounded="pill"
                  @click="selectPopularCharacter(character)"
                  min-height="48"
                >
                  <template v-slot:prepend>
                    <v-avatar size="32" :color="getRandomColor(character.id, 0.8)" class="mr-2">
                      {{ getInitials(character.name) }}
                    </v-avatar>
                  </template>
                  <span class="character-name">{{ character.name }}</span>
                </v-btn>
              </div>
            </v-card-text>
            <div class="text-center mt-4 mb-4">
              <v-btn
                icon="mdi-brightness-6"
                variant="text"
                @click="toggleTheme"
                class="mr-2"
              />
              <v-btn
                icon="mdi-cog"
                variant="text"
                @click="showAdvancedOptions = !showAdvancedOptions"
                class="mr-2"
              />
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-translate"
                    variant="text"
                    v-bind="props"
                  />
                </template>
                <v-list>
                  <v-list-item
                    v-for="lang in availableLanguages"
                    :key="lang.code"
                    :value="lang.code"
                    @click="changeLanguage(lang.code)"
                    :active="currentLanguage === lang.code"
                  >
                    <v-list-item-title>{{ lang.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ lang.nativeName }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-card>
          
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { characters } from '@/data/characters'
import { versions } from '@/data/versions'
import { models } from '@/data/models'

const router = useRouter()
const { t, locale } = useI18n()
const toggleTheme = inject('toggleTheme')
const theme = ref('light')
const selectedCharacter = ref(null)
const selectedVersion = ref(null)
const selectedModel = ref(null)
const showAdvancedOptions = ref(false)
const isDevelopment = process.env.NODE_ENV === 'development'

const availableLanguages = [
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' }
]

const currentLanguage = computed(() => locale.value)

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('language', lang)
}

const vibrantColors = [
  '#2196F3', // Blue
  '#00BCD4', // Cyan
  '#009688', // Teal
  '#4CAF50', // Green
  '#8BC34A', // Light Green
  '#CDDC39', // Lime
  '#FFC107', // Amber
  '#FF9800', // Orange
  '#FF5722', // Deep Orange
  '#F44336', // Red
  '#E91E63', // Pink
  '#9C27B0', // Purple
]

const getRandomColor = (seed, opacity = 1) => {
  const hash = seed.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  const color = vibrantColors[Math.abs(hash) % vibrantColors.length]
  return opacity === 1 ? color : `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
}

const getCharacterName = computed(() => {
  if (!selectedCharacter.value) return ''
  const character = characters.find(c => c.id === selectedCharacter.value)
  return character ? t(character.nameKey) : ''
})

const getCharacterInitials = computed(() => {
  if (!selectedCharacter.value) return '?'
  return getInitials(getCharacterName.value)
})

const getCharacterColor = computed(() => {
  if (!selectedCharacter.value) return 'grey'
  return getRandomColor(selectedCharacter.value)
})

const chatButtonText = computed(() => {
  if (!selectedCharacter.value) {
    return t('home.startChatDefault')
  }
  return t('home.startChat', { name: getCharacterName.value })
})

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const selectPopularCharacter = (character) => {
  selectedCharacter.value = character.id
}

const startChat = () => {
  router.push({
    name: 'chat',
    params: {
      characterId: selectedCharacter.value || 'bible'
    },
    query: {
      version: selectedVersion.value || 'NVI'
    }
  })
}

const popularCharacters = computed(() => 
  characters.slice(0, 9).map(char => ({
    id: char.id,
    name: t(char.nameKey)
  }))
)
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, var(--v-theme-primary), var(--v-theme-secondary));
  color: white;
  padding: 0rem 0rem 1rem;
  position: relative;
  z-index: 1;
}

.content-wrapper {
  position: relative;
  margin-top: 0rem;
  z-index: 2;
  padding: 0 1rem;
}

.chat-card {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  border-radius: 24px;
}

.chat-button {
  border-radius: 16px;
  text-transform: none;
  font-size: 1.1rem;
  letter-spacing: 0;
}

.button-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.character-button {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
  height: auto;
  padding: 8px 16px;
  width: 100%;
  display: flex;
  align-items: center;
}

.character-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
}

@media (min-width: 1264px) {
  .characters-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .character-button {
    padding: 12px 20px;
  }
}

@media (min-width: 960px) and (max-width: 1263px) {
  .characters-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .character-button {
    padding: 10px 18px;
  }
}

@media (max-width: 959px) {
  .chat-card {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
  }

  .characters-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}

@media (max-width: 600px) {
  .app-header {
    padding: 2rem 1rem 6rem;
  }

  .content-wrapper {
    padding: 0;
  }

  .chat-card {
    border-radius: 24px 24px 0 0;
  }

  .characters-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.75rem;
  }

  .text-h3 {
    font-size: 2rem !important;
  }

  .character-button {
    padding: 8px 14px;
    font-size: 0.9rem;
  }
}

/* Animações */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
  
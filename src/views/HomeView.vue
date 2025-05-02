<template>
    <v-container class="fill-height pa-0" fluid>
        <v-row
            justify="center"
            align="center"
            no-gutters
            style="min-height: 10vh"
        >
            <v-col cols="12" class="d-flex justify-center">
                <v-card class="main-card" elevation="8" rounded="lg">
                    <div class="app-header text-center">
                        <div class="header-content">
                            <v-icon
                                icon="mdi-book-cross"
                                size="64"
                                color="white"
                                class="mb-4"
                            />
                            <h1
                                class="text-h3 font-weight-bold mb-2 text-white"
                            >
                                {{ $t("home.title") }}
                            </h1>
                            <div class="text-subtitle-1 text-white">
                                {{ $t("home.subtitle") }}
                            </div>
                        </div>
                    </div>

                    <div class="content-wrapper mb-4">
                        <v-card class="chat-card" elevation="4" rounded="lg">
                            <v-card-text class="pa-6">
                                <v-autocomplete
                                    v-model="selectedCharacter"
                                    :items="characters"
                                    :item-title="(item) => t(item.nameKey)"
                                    item-value="id"
                                    :label="$t('home.selectCharacter')"
                                    variant="outlined"
                                    class="mb-4 character-select"
                                    prepend-inner-icon="mdi-account-search"
                                    clearable
                                    :menu-props="{
                                        location: $vuetify.display.mobile
                                            ? 'top'
                                            : 'bottom',
                                        offsetY: true,
                                        maxHeight: $vuetify.display.mobile
                                            ? '140vh'
                                            : '300px',
                                        transition: 'slide-y-transition',
                                        scrollStrategy: 'close',
                                    }"
                                    :hide-details="!selectedCharacter"
                                    bg-color="surface"
                                >
                                    <template v-slot:prepend>
                                        <div class="character-avatar mr-2">
                                            <v-img
                                                v-if="selectedCharacter"
                                                :src="getCharacterImage"
                                                :alt="getCharacterName"
                                                class="character-image"
                                                @error="
                                                    (e) =>
                                                        (e.target.src =
                                                            '/images/characters/avatar-neutro.svg')
                                                "
                                            >
                                                <template v-slot:error>
                                                    <v-img
                                                        src="/images/characters/avatar-neutro.svg"
                                                        :alt="getCharacterName"
                                                        class="character-image"
                                                    />
                                                </template>
                                            </v-img>
                                            <v-icon
                                                v-else
                                                icon="mdi-account-search"
                                                color="grey"
                                            />
                                        </div>
                                    </template>
                                </v-autocomplete>

                                <v-expand-transition>
                                    <div v-if="selectedCharacter">
                                        <v-btn
                                            block
                                            color="primary"
                                            size="x-large"
                                            class="mt-6 chat-button"
                                            elevation="2"
                                            @click="startChat"
                                            min-height="56"
                                        >
                                            <v-icon
                                                start
                                                icon="mdi-message-text"
                                                class="mr-2"
                                            />
                                            <span class="button-text">{{
                                                chatButtonText
                                            }}</span>
                                        </v-btn>
                                    </div>
                                </v-expand-transition>

                                <v-divider class="my-6" />

                                <div class="text-h6 mb-4 d-flex align-center">
                                    <v-icon
                                        icon="mdi-star"
                                        color="warning"
                                        class="mr-2"
                                    />
                                    {{ $t("home.popularCharacters") }}
                                </div>

                                <div class="characters-grid">
                                    <v-slide-x-transition group>
                                        <v-btn
                                            v-for="character in popularCharacters"
                                            :key="character.id"
                                            class="character-button"
                                            elevation="2"
                                            @click="
                                                selectPopularCharacter(
                                                    character
                                                )
                                            "
                                            min-height="80"
                                            block
                                        >
                                            <div
                                                class="d-flex align-center w-100"
                                            >
                                                <div
                                                    class="character-avatar mr-3"
                                                >
                                                    <v-img
                                                        :src="
                                                            getCharacterImageById(
                                                                character.id
                                                            )
                                                        "
                                                        :alt="character.name"
                                                        class="character-image"
                                                        @error="
                                                            (e) =>
                                                                (e.target.src =
                                                                    '/images/characters/avatar-neutro.svg')
                                                        "
                                                    >
                                                        <template v-slot:error>
                                                            <v-img
                                                                src="/images/characters/avatar-neutro.svg"
                                                                :alt="
                                                                    character.name
                                                                "
                                                                class="character-image"
                                                            />
                                                        </template>
                                                    </v-img>
                                                </div>
                                                <div
                                                    class="character-info flex-grow-1"
                                                >
                                                    <div class="character-name">
                                                        {{ character.name }}
                                                    </div>
                                                </div>
                                            </div>
                                        </v-btn>
                                    </v-slide-x-transition>
                                </div>
                            </v-card-text>

                            <v-card-actions
                                class="pa-4 d-flex justify-space-between"
                            >
                                <v-btn
                                    icon="mdi-brightness-6"
                                    variant="text"
                                    @click="toggleTheme"
                                />

                                <v-menu
                                    v-model="settingsMenuOpen"
                                    location="top"
                                    :close-on-content-click="false"
                                >
                                    <template v-slot:activator="{ props }">
                                        <v-btn
                                            icon="mdi-cog"
                                            variant="text"
                                            v-bind="props"
                                            @mousedown="startPressTimer"
                                            @mouseup="cancelPressTimer"
                                            @mouseleave="cancelPressTimer"
                                            @touchstart="startPressTimer"
                                            @touchend="cancelPressTimer"
                                        />
                                    </template>
                                    <v-list>
                                        <v-list-item>
                                            <v-select
                                                v-model="selectedVersion"
                                                :items="availableVersions"
                                                :item-title="
                                                    (item) => t(item.nameKey)
                                                "
                                                item-value="id"
                                                :label="$t('home.bibleVersion')"
                                                variant="outlined"
                                                density="comfortable"
                                                hide-details
                                                class="mt-2"
                                            />
                                        </v-list-item>
                                        <v-list-item>
                                            <v-select
                                                v-model="theme"
                                                :items="[
                                                    {
                                                        title: 'Auto',
                                                        value: 'auto',
                                                    },
                                                    {
                                                        title: 'Light',
                                                        value: 'light',
                                                    },
                                                    {
                                                        title: 'Dark',
                                                        value: 'dark',
                                                    },
                                                ]"
                                                :label="$t('home.theme')"
                                                variant="outlined"
                                                density="comfortable"
                                                hide-details
                                                @update:model-value="
                                                    updateTheme
                                                "
                                                class="mt-2"
                                            />
                                        </v-list-item>
                                    </v-list>
                                </v-menu>

                                <v-menu location="top">
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
                                            :active="
                                                currentLanguage === lang.code
                                            "
                                        >
                                            <v-list-item-title>{{
                                                lang.name
                                            }}</v-list-item-title>
                                            <v-list-item-subtitle>{{
                                                lang.nativeName
                                            }}</v-list-item-subtitle>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-card-actions>
                        </v-card>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="showModelSelect" max-width="400">
            <v-card>
                <v-card-title class="text-h5">
                    Selecione o Modelo
                </v-card-title>
                <v-card-text>
                    <v-select
                        v-model="selectedModel"
                        :items="models"
                        item-title="name"
                        item-value="id"
                        label="Modelo"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                        @update:model-value="handleModelChange"
                    />
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
    <v-footer class="footer-links">
        <v-row justify="center" class="text-center">
            <v-col cols="12">
                <v-btn
                    variant="text"
                    size="small"
                    class="mx-1"
                    :to="{ name: 'privacy' }"
                >
                    {{ $t("privacy.title") }}
                </v-btn>
                <v-btn
                    variant="text"
                    size="small"
                    class="mx-1"
                    :to="{ name: 'terms' }"
                >
                    {{ $t("terms.title") }}
                </v-btn>
                <v-btn
                    variant="text"
                    size="small"
                    class="mx-1"
                    :to="{ name: 'contact' }"
                >
                    {{ $t("contact.title") }}
                </v-btn>
            </v-col>
        </v-row>
    </v-footer>
    <v-card-text>
        <h1 class="text-h5 mb-2">{{ t("home.title") }}</h1>
        <p>{{ t("home.adsContent1") }}</p>
        <p>{{ t("home.adsContent2") }}</p>
        <p>{{ t("home.adsContent3") }}</p>
    </v-card-text>
</template>

<script setup>
    import { ref, computed, inject, onMounted, watch } from "vue";
    import { useRouter } from "vue-router";
    import { useI18n } from "vue-i18n";
    import { characters } from "@/data/characters";
    import { versions } from "@/data/versions";
    import { models } from "@/data/models";

    const router = useRouter();
    const { t, locale } = useI18n();
    const toggleTheme = inject("toggleTheme");
    const theme = ref(localStorage.getItem("theme") || "auto");
    const selectedCharacter = ref(null);
    const selectedVersion = ref(localStorage.getItem("bibleVersion") || null);
    const selectedModel = ref(
        localStorage.getItem("selectedModel") || "google/gemini-pro:free"
    );
    const showAdvancedOptions = ref(false);
    const isDevelopment = process.env.NODE_ENV === "development";
    const settingsMenuOpen = ref(false);
    const showModelSelect = ref(false);
    const pressTimer = ref(null);

    const availableLanguages = [
        { code: "pt", name: "Portuguese", nativeName: "Português" },
        { code: "en", name: "English", nativeName: "English" },
        { code: "es", name: "Spanish", nativeName: "Español" },
    ];

    const currentLanguage = computed(() => locale.value);

    const changeLanguage = (lang) => {
        locale.value = lang;
        localStorage.setItem("language", lang);
    };

    const vibrantColors = [
        "#2196F3", // Blue
        "#00BCD4", // Cyan
        "#009688", // Teal
        "#4CAF50", // Green
        "#8BC34A", // Light Green
        "#CDDC39", // Lime
        "#FFC107", // Amber
        "#FF9800", // Orange
        "#FF5722", // Deep Orange
        "#F44336", // Red
        "#E91E63", // Pink
        "#9C27B0", // Purple
    ];

    const getRandomColor = (seed, opacity = 1) => {
        const hash = seed.split("").reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        const color = vibrantColors[Math.abs(hash) % vibrantColors.length];
        return opacity === 1
            ? color
            : `${color}${Math.floor(opacity * 255)
                  .toString(16)
                  .padStart(2, "0")}`;
    };

    const getCharacterName = computed(() => {
        if (!selectedCharacter.value) return "";
        const character = characters.find(
            (c) => c.id === selectedCharacter.value
        );
        return character ? t(character.nameKey) : "";
    });

    const getCharacterInitials = computed(() => {
        if (!selectedCharacter.value) return "?";
        return getInitials(getCharacterName.value);
    });

    const getCharacterColor = computed(() => {
        if (!selectedCharacter.value) return "grey";
        return getRandomColor(selectedCharacter.value);
    });

    const chatButtonText = computed(() => {
        if (!selectedCharacter.value) {
            return t("home.startChatDefault");
        }
        return t("home.startChat", { name: getCharacterName.value });
    });

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const selectPopularCharacter = (character) => {
        selectedCharacter.value = character.id;
    };

    const startChat = () => {
        router.push({
            name: "chat",
            params: {
                characterId: selectedCharacter.value || "bible",
            },
            query: {
                version: selectedVersion.value || "NVI",
                model: selectedModel.value,
            },
        });
    };

    const popularCharacters = computed(() =>
        characters.slice(0, 9).map((char) => ({
            id: char.id,
            name: t(char.nameKey),
        }))
    );

    const getCharacterImage = computed(() => {
        if (!selectedCharacter.value) return null;
        return `/images/characters/${selectedCharacter.value}.png`;
    });

    const getCharacterImageById = (id) => {
        return `/images/characters/${id}.png`;
    };

    const availableVersions = computed(() => {
        return versions[locale.value] || versions.pt;
    });

    // Função para atualizar o tema
    const updateTheme = (newTheme) => {
        theme.value = newTheme;
        localStorage.setItem("theme", newTheme);

        if (newTheme === "auto") {
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            toggleTheme(prefersDark ? "dark" : "light");
        } else {
            toggleTheme(newTheme);
        }
    };

    // Configuração do tema ao montar o componente
    onMounted(() => {
        if (theme.value === "auto") {
            const mediaQuery = window.matchMedia(
                "(prefers-color-scheme: dark)"
            );
            mediaQuery.addEventListener("change", (e) => {
                if (theme.value === "auto") {
                    toggleTheme(e.matches ? "dark" : "light");
                }
            });
        }
    });

    // Watch para mudanças na versão da Bíblia
    watch(selectedVersion, (newVersion) => {
        if (newVersion) {
            localStorage.setItem("bibleVersion", newVersion);
        }
    });

    const startPressTimer = () => {
        pressTimer.value = setTimeout(() => {
            showModelSelect.value = true;
        }, 5000);
    };

    const cancelPressTimer = () => {
        if (pressTimer.value) {
            clearTimeout(pressTimer.value);
            pressTimer.value = null;
        }
    };

    const handleModelChange = (model) => {
        selectedModel.value = model;
        localStorage.setItem("selectedModel", model);
        showModelSelect.value = false;
    };
</script>

<style scoped>
    .main-card {
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        background: transparent;
        box-shadow: none;
    }

    .app-header {
        background: linear-gradient(135deg, #4a90e2, #357abd);
        padding: 3rem 1rem 4rem;
        position: relative;
        z-index: 1;
        overflow: hidden;
        border-radius: 24px 24px 0 0;
    }

    .header-content {
        position: relative;
        z-index: 2;
    }

    .app-header::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("/path/to/pattern.svg") center/cover;
        opacity: 0.1;
        z-index: 1;
    }

    .content-wrapper {
        position: relative;
        margin-top: -2rem;
        z-index: 2;
        padding: 0 1rem;
    }

    .chat-card {
        width: 100%;
        margin: 0 auto;
        border-radius: 24px;
        background: rgb(var(--v-theme-surface));
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    }

    .chat-button {
        border-radius: 16px;
        text-transform: none;
        font-size: 1.1rem;
        letter-spacing: 0;
        transition: transform 0.2s;
        background: linear-gradient(135deg, #4a90e2, #357abd);
        color: white;
    }

    .chat-button:hover {
        transform: translateY(-2px);
        background: linear-gradient(135deg, #357abd, #4a90e2);
    }

    .characters-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        padding: 1rem 0;
    }

    .character-button {
        text-transform: none;
        letter-spacing: 0;
        font-weight: 500;
        border-radius: 16px;
        transition: all 0.3s ease;
        background: rgb(var(--v-theme-surface));
        border: 1px solid rgba(var(--v-theme-primary), 0.3);
    }

    .character-button:hover {
        transform: translateY(-2px);
        background: rgb(var(--v-theme-surface-variant));
        box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.2);
    }

    .character-info {
        text-align: left;
    }

    .character-name {
        font-size: 1.1rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: rgb(var(--v-theme-on-surface));
    }

    .character-avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;
        background: rgb(var(--v-theme-surface));
        border: 2px solid rgba(var(--v-theme-primary), 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .character-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        padding: 8px;
    }

    .character-select {
        :deep(.v-field) {
            border-radius: 16px;
            border: 1px solid rgba(var(--v-theme-primary), 0.3);
        }

        :deep(.v-field:hover) {
            border-color: rgba(var(--v-theme-primary), 0.5);
        }

        :deep(.v-field--focused) {
            border-color: rgb(var(--v-theme-primary));
            box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.2);
        }

        :deep(.v-menu) {
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        :deep(.v-list) {
            background: rgb(var(--v-theme-surface));
        }

        :deep(.v-list-item) {
            border-radius: 8px;
            margin: 4px 8px;
            color: rgb(var(--v-theme-on-surface));
        }

        :deep(.v-list-item:hover) {
            background: rgba(var(--v-theme-primary), 0.1);
        }

        :deep(.v-field__input),
        :deep(.v-field__label) {
            color: rgb(var(--v-theme-on-surface));
        }

        :deep(.v-field__overlay) {
            background-color: rgb(var(--v-theme-surface));
        }
    }

    @media (max-width: 1200px) {
        .characters-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 900px) {
        .characters-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 600px) {
        .app-header {
            padding: 2rem 1rem 3rem;
            border-radius: 0;
        }

        .content-wrapper {
            padding: 0;
            margin-top: -1rem;
        }

        .chat-card {
            border-radius: 0;
        }

        .text-h3 {
            font-size: 2rem !important;
        }

        .characters-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
        }

        .character-button {
            padding: 12px;
        }

        .character-avatar {
            width: 48px;
            height: 48px;
        }

        :deep(.v-autocomplete) {
            position: sticky;
            top: 0;
            z-index: 10;
            padding: 8px 0;
            margin-bottom: 8px;
            backdrop-filter: blur(10px);
        }

        :deep(.v-overlay__content) {
            background: rgb(var(--v-theme-surface));
            max-height: 35vh !important;
            margin-top: -35vh !important;
        }

        :deep(.v-list) {
            background: rgb(var(--v-theme-surface));
            max-height: 35vh !important;
            overflow-y: auto;
        }

        :deep(.v-list-item) {
            min-height: 48px !important;
            padding: 8px !important;
        }

        :deep(.v-field__input) {
            min-height: 44px !important;
            padding-top: 8px !important;
            padding-bottom: 8px !important;
        }
    }

    /* Animações */
    .v-enter-active,
    .v-leave-active {
        transition: all 0.3s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
        transform: translateY(20px);
    }

    .character-button-enter-active,
    .character-button-leave-active {
        transition: all 0.3s ease;
    }

    .character-button-enter-from,
    .character-button-leave-to {
        opacity: 0;
        transform: translateX(-20px);
    }

    .footer-links {
        /* position: fixed; */
        bottom: 0;
        left: 0;
        right: 0;
        background: transparent;
        z-index: 1;
        padding: 8px;
        opacity: 0.6;
        transition: opacity 0.3s;
    }

    .footer-links:hover {
        opacity: 1;
    }

    .footer-links :deep(.v-btn) {
        text-transform: none;
        font-size: 0.8rem;
        opacity: 0.8;
    }

    .footer-links :deep(.v-btn:hover) {
        opacity: 1;
    }
</style>

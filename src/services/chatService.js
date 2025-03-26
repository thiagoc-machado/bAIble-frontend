import axios from 'axios'
import { useI18n } from 'vue-i18n'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/graphql/'

const chatService = {
  async sendMessage({ message, characterId, version, model, history, language }) {
    try {
      const query = `
        query AskBibleCharacter(
          $message: String!,
          $character: String,
          $version: String!,
          $language: String!,
          $model: String!,
          $history: [ChatMessageInput!]
        ) {
          askBibleCharacter(
            message: $message,
            character: $character,
            version: $version,
            language: $language,
            model: $model,
            history: $history
          )
        }
      `

      const response = await axios.post(API_URL, {
        query,
        variables: {
          message,
          character: characterId,
          version,
          language,
          model,
          history
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
  
      return {
        message: response.data.data.askBibleCharacter
      };
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  },

  async getCharacterInfo(characterId) {
    try {
      const query = `
        query {
          character(id: "${characterId}") {
            id
            name
            description
          }
        }
      `

      const response = await axios.post(API_URL, {
        query,
        variables: {}
      })

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message)
      }

      return response.data.data.character
    } catch (error) {
      console.error('Erro ao buscar informações do personagem:', error)
      throw error
    }
  }
}

export default chatService 
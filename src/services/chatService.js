import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/graphql/'

const chatService = {
  async sendMessage({ message, characterId, version, language }) {
    try {
      const query = `
        query {
          askBibleCharacter(
            message: "${message}",
            character: "${characterId}",
            version: "${version}",
            language: "${language}"
          )
        }
      `

      const response = await axios.post(API_URL, {
        query,
        variables: {}
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message)
      }

      return {
        message: response.data.data.askBibleCharacter
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      throw error
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
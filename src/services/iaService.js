import { request, gql } from 'graphql-request'

const endpoint = 'http://localhost:8000/graphql'

const ASK_BIBLE_CHARACTER = gql`
  query Ask($message: String!, $character: String, $version: String!, $language: String!) {
    askBibleCharacter(message: $message, character: $character, version: $version, language: $language)
  }
`

export async function askBibleCharacter({ message, character, version, language }) {
  const variables = { message, character, version, language }
  const data = await request(endpoint, ASK_BIBLE_CHARACTER, variables)
  return data.askBibleCharacter
}

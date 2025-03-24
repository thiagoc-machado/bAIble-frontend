import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#FFFFFF',
          surface: '#F7F7F7',
          primary: '#4A90E2',
          secondary: '#FFC107',
          error: '#FF5252',
          success: '#4CAF50',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: '#121212',
          surface: '#1E1E1E',
          primary: '#90CAF9',
          secondary: '#FFD54F',
          error: '#EF5350',
          success: '#66BB6A',
        },
      },
    },
  },
})

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#4A90E2',
          secondary: '#357ABD',
          accent: '#2C3E50',
          background: '#F5F7FA',
          surface: '#FFFFFF',
          'surface-variant': '#F8F9FA',
          'on-surface': '#2C3E50',
          'on-surface-variant': '#4A4A4A',
          error: '#FF6B6B',
          success: '#4CAF50',
          warning: '#FFA726',
          info: '#4A90E2',
        },
      },
      dark: {
        colors: {
          primary: '#4A90E2',
          secondary: '#357ABD',
          accent: '#2C3E50',
          background: '#1A1A1A',
          surface: '#2D2D2D',
          'surface-variant': '#3D3D3D',
          'on-surface': '#FFFFFF',
          'on-surface-variant': '#CCCCCC',
          error: '#FF6B6B',
          success: '#4CAF50',
          warning: '#FFA726',
          info: '#4A90E2',
        },
      },
    },
  },
}) 
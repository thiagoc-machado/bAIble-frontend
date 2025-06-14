# bAIble Frontend

bAIble is a multilingual Bible study assistant built with Vue 3 and Vite. It allows users to chat with biblical characters powered by AI while keeping the interface simple and mobile‑friendly.

## Features

- Conversational interface for questions about Scripture
- AI models selectable by the user
- Supports Portuguese, English and Spanish
- Choice of Bible versions per language
- Responsive design using Vuetify
- Cookie consent, privacy policy and terms pages
- Dockerfile and Capacitor configuration for deployment

## Requirements

- Node.js 20+
- npm
- (Optional) Docker for containerized builds
- (Optional) Android Studio if packaging the mobile app

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure the GraphQL endpoint in a `.env` file:
   ```bash
   VITE_API_URL=http://localhost:8000/graphql/
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173` in your browser.
4. Build for production:
   ```bash
   npm run build
   ```
5. Preview the production build:
   ```bash
   npm run preview
   ```

## Docker

To create a production container:

```bash
docker build -t baible-frontend .
docker run -p 80:80 baible-frontend
```

## Mobile (Capacitor)

After building the web assets you can sync them to the Android project:

```bash
npm run build
npx cap sync android
```

Open the `android` directory in Android Studio to run or package the app.

## Project Layout

- `src/` – application source code
  - `views/` – main pages such as Home, Chat, Privacy, Terms and Contact
  - `data/` – predefined characters, Bible versions and model options
  - `locales/` – translation files
  - `services/` – helper modules that call the GraphQL API
- `public/` – static assets served at the root
- `Dockerfile` and `nginx.conf` – used to build and serve the production image

Contributions are welcome! Feel free to open issues or pull requests.

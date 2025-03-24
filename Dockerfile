# Build stage
FROM node:20-alpine as build-stage

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Construir aplicação
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

# Copiar arquivos de build
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 
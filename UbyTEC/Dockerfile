# Usa la imagen de Node.js como base para la construcción
FROM node:20 AS build

# Configura el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración de npm
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia los archivos del proyecto
COPY . .

# Construye el proyecto de Angular en modo desarrollo usando la configuración de desarrollo
RUN npx ng build --configuration=development

# Usa una imagen ligera de Nginx para servir la aplicación
FROM nginx:alpine

# Copia los archivos construidos de Angular desde la etapa de construcción
COPY --from=build /app/dist/uby-tec/browser /usr/share/nginx/html

# Expone el puerto 80 para acceder a la aplicación
EXPOSE 80
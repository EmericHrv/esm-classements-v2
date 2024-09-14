FROM node:21.4.0-alpine

# Installer tzdata pour les fuseaux horaires
RUN apk add --no-cache tzdata

# Configurer le fuseau horaire sur Europe/Paris
ENV TZ=Europe/Paris

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

# Utiliser Node.js comme image de base
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour optimiser le cache Docker
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Installer Nodemon globalement pour le hot reload
RUN npm install -g nodemon

# Copier le reste du code source
COPY . .

# Exposer le port sur lequel l'application tourne
EXPOSE 4200

# Lancer le serveur de développement avec Nodemon
CMD ["nodemon", "start"]

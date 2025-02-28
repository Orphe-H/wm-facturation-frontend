# Étape 1 : Choisir une image de base Node.js
FROM node:20-alpine

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Étape 3 : Copier les fichiers de configuration des dépendances
COPY package*.json pnpm-lock.yaml ./

# Étape 4 : Installer pnpm globalement
RUN npm install -g pnpm 

# Étape 5 : Installer les dépendances
RUN pnpm install

# Étape 6 : Copier le reste du code source
COPY . .

# Étape 7 : Compiler l'application NestJS
RUN pnpm build

# Étape 8 : Nettoyer les dépendances de développement
RUN pnpm prune --prod

# Étape 9 : Exposer le port
EXPOSE 3000

# Étape 10 : Utiliser le script comme point d'entrée
CMD ["pnpm", "prod"]
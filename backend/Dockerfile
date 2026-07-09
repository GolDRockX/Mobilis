# Dockerfile for Mobilis backend — used for container-based hosting (Back4App, etc.)
# This does not affect your local dev workflow at all.

FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 5001

CMD ["npm", "start"]

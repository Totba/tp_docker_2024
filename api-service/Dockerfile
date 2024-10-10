# Étape de construction
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .

# Étape finale
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 3000
CMD ["node", "index.js"]

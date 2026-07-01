# --- Build Stage ---
FROM node:22-alpine AS builder
WORKDIR /app

# Salin package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Install dependensi untuk build
RUN npm ci

# Salin seluruh kode proyek
COPY . .

# Build aplikasi Astro (menggunakan Node.js standalone adapter)
RUN npm run build

# --- Runtime Stage ---
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install hanya dependensi production untuk meminimalkan ukuran image
RUN npm ci --only=production

# Salin hasil build dari stage builder
COPY --from=builder /app/dist ./dist

# Expose port (sesuai port di .env / default Astro server)
EXPOSE 3001

# Jalankan entrypoint server Astro
CMD ["node", "./dist/server/entry.mjs"]

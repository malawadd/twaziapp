# Use official Node.js image
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install 

COPY . .

RUN npx prisma generate
RUN npm run build

# ---- Step 2: Create Final Production Image ----
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/prisma ./prisma 

# Expose dynamic port (default 3000)
ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}

# Start the app with a dynamic port
CMD ["sh", "-c", "npm run start -- -p $PORT"]

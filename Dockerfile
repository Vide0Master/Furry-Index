FROM node:24.5.0-alpine

RUN apk update && \
    apk add --no-cache ffmpeg

ENV DATABASE_URL=postgresql://postgres:postgres@postgres:5432/furry-index?schema=public
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN chmod +x start.sh

ENTRYPOINT [ "./start.sh" ]

FROM node:20.19.1-alpine

ENV DATABASE_URL=postgresql://postgres:postgres@postgres:5432/furry-index?schema=public
WORKDIR /bot

COPY . .
RUN npm ci
RUN npx prisma generate

ENTRYPOINT [ "./start.sh" ]

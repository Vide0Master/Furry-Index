#!/bin/sh
npx prisma migrate deploy
node index.js

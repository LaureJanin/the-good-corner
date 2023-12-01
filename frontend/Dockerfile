FROM node:18.18.2-alpine3.18

WORKDIR /app

COPY package.json package.json
# COPY package-lock.json package-lock.json
RUN npm i

COPY src src
COPY public public
COPY tsconfig.json tsconfig.json
COPY next.config.js next.config.js
COPY next-env.d.ts next-env.d.ts
COPY .eslintrc.json .eslintrc.json
RUN npm run build

CMD npm start
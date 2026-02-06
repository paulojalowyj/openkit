FROM node:22-alpine AS base

WORKDIR /app

COPY package.json ./

RUN npm install

FROM base AS build

COPY . .

RUN npm run build

FROM base AS dev

RUN npm install -g nodemon

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
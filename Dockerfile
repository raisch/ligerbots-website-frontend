FROM node:22-alpine

WORKDIR /app

COPY package.json /app
COPY pnpm-lock.yaml /app
COPY ./build /app

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

ENV PUBLIC_SERVER_HOST="127.0.0.1"
ENV PUBLIC_SERVER_PORT=4000

ENV API_URL="https://admin.0mo.cc"
ENV API_TOKEN="wGDwy1iiA6I2dJabtcF_mkrqyAgAMY-9"
ENV API_SCHEME="https"
ENV API_HOST="admin.0mo.cc"
ENV API_PORT=443

EXPOSE ${PUBLIC_SERVER_PORT}

CMD ["node", "./build/index.js"]
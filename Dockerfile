FROM node:22-alpine

WORKDIR /app

COPY . .

RUN rm -rf node_modules build
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm run build

ENV PUBLIC_SERVER_HOST="127.0.0.1"
ENV PUBLIC_SERVER_PORT=4000

ENV API_URL="https://admin.0mo.cc"
ENV API_TOKEN="wGDwy1iiA6I2dJabtcF_mkrqyAgAMY-9"
ENV API_SCHEME="https"
ENV API_HOST="admin.0mo.cc"
ENV API_PORT=443
ENV PORT=4000

EXPOSE ${PUBLIC_SERVER_PORT}

CMD ["node", "./build/index.js"]

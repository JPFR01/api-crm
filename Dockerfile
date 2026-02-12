FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn run build
RUN yarn install --production --ignore-scripts --prefer-offline --frozen-lockfile && yarn cache clean
FROM node:22-alpine AS runner
RUN apk update && \
    apk add --no-cache tini curl
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/infrastructure/swagger/yaml ./dist/infrastructure/swagger/yaml

ENV PORT=3000

RUN echo $(date) > deploy-date.txt

EXPOSE 3000

ENTRYPOINT [ "/sbin/tini", "--" ]
CMD ["yarn", "start"]


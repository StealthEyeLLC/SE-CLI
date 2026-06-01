# SE-CLI Render image.
#
# P1A replaces the bootstrap inline server with the real TypeScript MCP app.
# The runtime remains read-only: health, readiness, status, and read-only docs tools.

FROM node:24-slim AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
COPY ops ./ops

RUN pnpm install --no-frozen-lockfile
RUN pnpm build
RUN pnpm prune --prod

FROM node:24-slim AS runtime

ENV NODE_ENV=production
ENV SECLI_ENV=production
ENV PORT=10000
ENV SECLI_MCP_PATH=/mcp

WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps ./apps
COPY --from=build /app/packages ./packages
COPY --from=build /app/ops ./ops

EXPOSE 10000

CMD ["node", "apps/mcp-server/dist/index.js"]

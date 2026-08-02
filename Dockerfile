FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time, so they
# must be supplied as build args (docker-compose passes these from .env.local).
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=$NEXT_PUBLIC_RAZORPAY_KEY_ID
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# BACKEND_URL isn't a NEXT_PUBLIC_* var (it's only read server-side), but for
# `output: 'standalone'` builds, next.config.js's rewrites() is evaluated
# ONCE during `next build` and its resolved destination is baked as a static
# string into the generated server.js — it is NOT re-read from the
# environment at runtime. So this must be supplied as a build arg too, same
# as the container's runtime BACKEND_URL, or the rewrite silently bakes in
# the http://localhost:5000 fallback and every /api/* call 500s in prod.
ARG BACKEND_URL
ENV BACKEND_URL=$BACKEND_URL

# Calls next build directly rather than the npm "build" script — that script
# sets NODE_TLS_REJECT_UNAUTHORIZED=0 for the maintainer's local network, which
# has no place in a production image build.
RUN npx next build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# The container runtime sets HOSTNAME to the container's own hostname (e.g.
# Render's "srv-xxxx"), and the standalone server.js does
# `process.env.HOSTNAME || '0.0.0.0'` — so without this override it tries to
# bind to that hostname instead of all interfaces, and the platform's proxy
# can never reach it (502 "unable to handle this request" despite the
# process logging that it started fine).
ENV HOSTNAME=0.0.0.0
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]

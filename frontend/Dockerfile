FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# ARG VITE_API_URL
# ENV VITE_API_URL=$VITE_API_URL

RUN npm run build   # Only Vite build

FROM node:18-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/dist .
EXPOSE 5173
CMD ["serve", "-s", ".", "-l", "5173"]
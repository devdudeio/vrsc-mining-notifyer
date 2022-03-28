FROM node:16.14.2
WORKDIR /app
COPY . .
RUN npm ci && \
    npm install pm2 -g
CMD ["pm2-runtime", "process.yml"]
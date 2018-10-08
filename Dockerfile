FROM node:8
WORKDIR /app
COPY package*.json ./

RUN npm install
RUN tsc

COPY . .
EXPOSE 8080
CMD ["npm", "start"]
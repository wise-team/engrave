FROM node:alpine

# Copy ENGRAVE
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Install blog template app
WORKDIR /app/blog
RUN npm install

# Compile ENGRAVE app
WORKDIR /app

RUN npm install -g pm2
RUN npm install -g typescript

RUN tsc

EXPOSE 80

CMD ["npm", "start"]
FROM ubuntu

# Download and Install Nginx and Node
RUN apt update && apt install -y nginx nodejs npm

COPY nginx/nginx-watch.sh /etc/nginx/
COPY nginx/_default.conf /etc/nginx/conf.d/

# Watch will restart nginx on every change in configuration files caused by ENGRAVE app
WORKDIR /etc/nginx
RUN ./nginx-watch.sh & 

# Copy ENGRAVE
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Install blog template app
WORKDIR /app/blog_app_template
RUN npm install

# Compile ENGRAVE app
WORKDIR /app
RUN npm install -g pm2
RUN npm install -g typescript
RUN tsc

EXPOSE 8080

CMD ["npm", "start"]
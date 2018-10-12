FROM nginx

COPY nginx-watch.sh /etc/nginx/

COPY ./conf/* /etc/nginx/conf.d/

# Watch will restart nginx on every change in configuration files caused by ENGRAVE app
WORKDIR /etc/nginx
RUN ./nginx-watch.sh & 

EXPOSE 80
EXPOSE 443
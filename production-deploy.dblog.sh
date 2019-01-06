
docker build ./nginx/ -f ./nginx/Dockerfile.dblog.production -t bgornicki/nginx
docker build ./engrave/ -f ./engrave/Dockerfile.production -t bgornicki/engrave
docker build ./engrave-statistics/ -f ./engrave-statistics/Dockerfile.production -t bgornicki/engrave-statistics
docker build ./engrave-image-uploader/ -f ./engrave-image-uploader/Dockerfile.production -t bgornicki/engrave-image-uploader
docker build ./engrave-api-gateway/ -f ./engrave-api-gateway/Dockerfile.production -t bgornicki/engrave-api-gateway
docker build ./engrave-ssl/ -f ./engrave-ssl/Dockerfile.production -t bgornicki/engrave-ssl
docker build ./engrave-nginx-configurator/ -f ./engrave-nginx-configurator/Dockerfile.production -t bgornicki/engrave-nginx-configurator

docker stack rm engrave

until [ -z "$(docker service ls --filter label=com.docker.stack.namespace=engrave -q)" ] || [ 60 -lt 0 ]; do
  echo 'Waiting for services to be removed...'
  sleep 1;
done

until [ -z "$(docker network ls --filter label=com.docker.stack.namespace=engrave -q)" ] || [ 60 -lt 0 ]; do
  echo 'Waiting for network to be removed...'
  sleep 1;
done

docker stack deploy -c docker-compose.dblog.production.yml engrave

# docker build ./nginx/ -f ./nginx/Dockerfile.development -t bgornicki/nginx
docker build ./engrave-front-dashboard/ -f ./engrave-front-dashboard/Dockerfile.development -t bgornicki/engrave-front-dashboard
docker build ./engrave-frontpage/ -f ./engrave-frontpage/Dockerfile.development -t bgornicki/engrave-frontpage
docker build ./engrave-statistics/ -f ./engrave-statistics/Dockerfile.development -t bgornicki/engrave-statistics
docker build ./engrave-image-uploader/ -f ./engrave-image-uploader/Dockerfile.development -t bgornicki/engrave-image-uploader
docker build ./engrave-api-gateway/ -f ./engrave-api-gateway/Dockerfile.development -t bgornicki/engrave-api-gateway
docker build ./engrave-ssl/ -f ./engrave-ssl/Dockerfile.development -t bgornicki/engrave-ssl
docker build ./engrave-nginx-configurator/ -f ./engrave-nginx-configurator/Dockerfile.development -t bgornicki/engrave-nginx-configurator
docker build ./engrave-blogs-renderer/ -f ./engrave-blogs-renderer/Dockerfile.development -t bgornicki/engrave-blogs-renderer
docker build ./engrave-blockchain-tracker/ -f ./engrave-blockchain-tracker/Dockerfile.development -t bgornicki/engrave-blockchain-tracker
docker build ./engrave-auth/ -f ./engrave-auth/Dockerfile.development -t bgornicki/engrave-auth
docker build ./engrave-mailer/ -f ./engrave-mailer/Dockerfile.development -t bgornicki/engrave-mailer
docker build ./engrave-webpush-sender/ -f ./engrave-webpush-sender/Dockerfile.development -t bgornicki/engrave-webpush-sender
docker build ./engrave-vault-connector/ -f ./engrave-vault-connector/Dockerfile.development -t bgornicki/engrave-vault-connector
docker build ./engrave-sitemap-builder/ -f ./engrave-sitemap-builder/Dockerfile.development -t bgornicki/engrave-sitemap-builder

docker build ./nginx/ -f ./nginx/Dockerfile.development -t bgornicki/nginx

docker stack rm engrave

until [ -z "$(docker service ls --filter label=com.docker.stack.namespace=engrave -q)" ] || [ 60 -lt 0 ]; do
  echo 'Waiting for services to be removed...'
  sleep 1;
done

until [ -z "$(docker network ls --filter label=com.docker.stack.namespace=engrave -q)" ] || [ 60 -lt 0 ]; do
  echo 'Waiting for network to be removed...'
  sleep 1;
done

docker stack deploy -c docker-compose.engrave.development.yml engrave
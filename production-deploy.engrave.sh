docker build ./engrave-api-gateway/ -f ./engrave-api-gateway/Dockerfile.production -t bgornicki/engrave-api-gateway
docker build ./engrave-blockchain-tracker/ -f ./engrave-blockchain-tracker/Dockerfile.production -t bgornicki/engrave-blockchain-tracker
docker build ./engrave-blogs-renderer/ -f ./engrave-blogs-renderer/Dockerfile.production -t bgornicki/engrave-blogs-renderer
docker build ./engrave-front-dashboard/ -f ./engrave-front-dashboard/Dockerfile.production -t bgornicki/engrave-front-dashboard
docker build ./engrave-image-uploader/ -f ./engrave-image-uploader/Dockerfile.production -t bgornicki/engrave-image-uploader
docker build ./engrave-nginx-configurator/ -f ./engrave-nginx-configurator/Dockerfile.production -t bgornicki/engrave-nginx-configurator
docker build ./engrave-ssl/ -f ./engrave-ssl/Dockerfile.production -t bgornicki/engrave-ssl
docker build ./engrave-statistics/ -f ./engrave-statistics/Dockerfile.production -t bgornicki/engrave-statistics
docker build ./engrave-auth/ -f ./engrave-auth/Dockerfile.production -t bgornicki/engrave-auth
docker build ./nginx/ -f ./nginx/Dockerfile.engrave.production -t bgornicki/nginx

docker stack deploy -c docker-compose.engrave.production.yml engrave
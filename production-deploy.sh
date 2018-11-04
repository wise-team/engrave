
docker build ./nginx/ -f ./nginx/Dockerfile.production -t bgornicki/nginx
docker build ./engrave/ -f ./engrave/Dockerfile.production -t bgornicki/engrave

docker stack rm engrave
docker stack deploy -c docker-compose.production.yml engrave
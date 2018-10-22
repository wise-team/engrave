docker stack rm engrave

docker build ./nginx/ -f ./nginx/Dockerfile.development -t bgornicki/nginx
docker build ./engrave/ -f ./engrave/Dockerfile.development -t bgornicki/engrave

docker stack deploy -c docker-compose.development.yml engrave
docker stack rm dblog

until [ -z "$(docker service ls --filter label=com.docker.stack.namespace=dblog -q)" ] || [ 60 -lt 0 ]; do
  echo 'Waiting for services to be removed...'
  sleep 1;
done

until [ -z "$(docker network ls --filter label=com.docker.stack.namespace=dblog -q)" ] || [ 60 -lt 0 ]; do
  echo 'Waiting for network to be removed...'
  sleep 1;
done

docker stack deploy -c docker-compose.dblog.production.yml dblog
echo "Remember to unseal the vault!"
if [ "$1" != "" ]; then
    docker run -it --rm --name letsencrypt \
        -v "engrave_nginx_certs:/etc/letsencrypt" \
        -v "engrave_nginx_certs:/var/lib/letsencrypt" \
        quay.io/letsencrypt/letsencrypt:latest \
            certonly \
            -d $1 \
            -d *.$1 \
            --manual \
            --preferred-challenges dns \
            --server https://acme-v02.api.letsencrypt.org/directory
else 
    echo "You need to provide domain name!"
fi
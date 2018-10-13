docker run -it --rm --name letsencrypt \
    -v "engrave_nginx_certs:/etc/letsencrypt" \
    -v "engrave_nginx_certs:/var/lib/letsencrypt" \
    quay.io/letsencrypt/letsencrypt:latest \
        certonly \
        -d engrave.website \
        -d *.engrave.website \
        --manual \
        --preferred-challenges dns \
        --server https://acme-v02.api.letsencrypt.org/directory
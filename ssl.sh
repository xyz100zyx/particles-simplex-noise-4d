#!/bin/sh

mkdir -p /etc/nginx/ssl

if [ "$SSL_TYPE" = "selfsigned" ] || [ ! -f /etc/nginx/ssl/nginx.crt ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/nginx.key \
        -out /etc/nginx/ssl/nginx.crt \
        -subj "/C=${SSL_COUNTRY:-US}/ST=${SSL_STATE:-State}/L=${SSL_CITY:-City}/O=${SSL_ORG:-Organization}/CN=${SSL_DOMAIN:-localhost}"
fi
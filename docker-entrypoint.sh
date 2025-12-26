#!/bin/sh

if [ ! -f /etc/nginx/ssl/nginx.crt ]; then
    echo "Generating SSL certificate..."
    /usr/local/bin/generate-ssl.sh
fi

if [ -f /etc/nginx/service-worker-config.json ]; then
    echo "Configuring Service Worker caching headers..."
    cp /etc/nginx/service-worker-config.json /usr/share/nginx/html/
fi

exec "$@"
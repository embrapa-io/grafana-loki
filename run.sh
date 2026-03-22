#!/bin/sh

# nginx config variable injection (explicit variable list to avoid clobbering)
envsubst '${FORWARD_HOST} ${FORWARD_PORT}' < nginx-basic-auth.conf > /etc/nginx/conf.d/default.conf

# htpasswd for basic authentication
htpasswd -c -b /etc/nginx/.htpasswd $BASIC_USERNAME $BASIC_PASSWORD

nginx -g "daemon off;"

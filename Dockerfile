FROM nginx:1.27.4-alpine

RUN apk add --no-cache apache2-utils gettext

# Basic auth credentials
ENV BASIC_USERNAME=username
ENV BASIC_PASSWORD=password

# Forward host and forward port as env variables
ENV FORWARD_HOST=google.com
ENV FORWARD_PORT=80

# Nginx config file
WORKDIR /
COPY nginx-basic-auth.conf nginx-basic-auth.conf

# Startup script
COPY run.sh ./
RUN chmod 0755 ./run.sh
CMD [ "./run.sh" ]

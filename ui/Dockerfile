FROM ubuntu:latest

MAINTAINER szaszdex@gmail.com

RUN mkdir -p /opt/olympos && mkdir -p /var/www/static
ADD ./server/src/aphrodite /opt/olympos/aphrodite
ADD ./public/* /var/www/static/
ADD ./dist/* /var/www/static/
WORKDIR /opt/olympos

CMD ["/opt/olympos/aphrodite"]
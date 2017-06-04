FROM ubuntu:latest

MAINTAINER szaszdex@gmail.com

RUN apt-get -y update && apt-get -y install gcc && apt-get -y install g++ && apt-get -y install python2.7
RUN mkdir -p /opt/olympos && mkdir -p /mnt/out && mkdir -p /mnt/test
WORKDIR /opt/olympos

ADD ./src/gaia /opt/olympos/gaia

ENV TEST_ROOT=/mnt/test
ENV OUT_ROOT=/mnt/out

CMD ["/opt/olympos/gaia"]

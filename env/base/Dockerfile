FROM ubuntu:latest

MAINTAINER szaszdex@gmail.com

ENTRYPOINT "/bin/bash"

RUN apt-get -y update
RUN apt-get -y install python

# Create basic lab structure
RUN mkdir -p /opt/test
ENV LAB_ROOT /opt/test
ENV LAB_NAME base
ENV LAB_VERSION 1.0.0

RUN mkdir -p /tmp/test
ENV TEST_ROOT /tmp/test

RUN mkdir -p /tmp/out
ENV LAB_OUT /tmp/out

COPY ./scripts /opt/test

CMD "cd /opt/test && python main.py"

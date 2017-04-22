FROM ubuntu:latest

MAINTAINER szaszdex@gmail.com

ENTRYPOINT "/bin/bash"

RUN apt-get -y update
RUN apt-get -y install python

# Create basic lab structure
RUN mkdir -p /opt/gaia
RUN mkdir -p /test
RUN mkdir -p /out

COPY ./scripts /opt/gaia

CMD "cd /opt/gaia && python main.py"

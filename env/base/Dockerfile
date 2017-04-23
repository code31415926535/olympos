FROM ubuntu:latest

MAINTAINER szaszdex@gmail.com

ENTRYPOINT "/bin/bash"

# install packages
RUN apt-get -y update
RUN apt-get -y install python
RUN apt-get -y install curl

# installing pip
RUN curl "https://bootstrap.pypa.io/get-pip.py" -o "get-pip.py"
RUN python get-pip.py
RUN rm get-pip.py

# installing pyyaml
RUN pip install pyyaml

# install gcc
RUN apt-get -y install gcc

# Create basic lab structure
RUN mkdir -p /opt/olympos/gaia
RUN mkdir -p /mnt/test
RUN mkdir -p /mnt/out

# Test related
ENV TEST_ROOT=/mnt/test
ENV OUT_ROOT=/mnt/out

COPY ./scripts /opt/olympos/gaia

ADD ./entrypoint.sh /

ENTRYPOINT /entrypoint.sh
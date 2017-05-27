FROM ubuntu:latest

RUN mkdir -p /opt/olympos && mkdir /stage && mkdir /log && mkdir /out
WORKDIR /opt/olympos

COPY ./src/hermes /opt/olympos

ENV HERMES_STAGING_DIR /stage
ENV HERMES_OUTPUT_DIR /out
ENV HERMES_LOG_DIR /log

CMD ["/opt/olympos/hermes"]

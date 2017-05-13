FROM ubuntu:latest

RUN mkdir -p /opt/olympos && mkdir /stage && mkdir /log && mkdir /out
WORKDIR /opt/olympos

COPY ./src/hermes /opt/olympos

ENV HERMES_STAGE_DIR /stage
ENV HERMES_OUT_DIR /out
ENV HERMES_LOG_DIR /log

CMD ["/opt/olympos/hermes"]

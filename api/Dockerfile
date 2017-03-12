FROM node:latest

RUN mkdir -p /opt/olympos
WORKDIR /opt/olympos

COPY src/ /opt/olympos/
RUN npm install

CMD ["npm", "start"]

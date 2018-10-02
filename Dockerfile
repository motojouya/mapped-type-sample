FROM node:9.10.0

RUN export DEBIAN_FRONTEND=noninteractive LANG && \
    apt-get update && \
    apt-get install -y apt-utils && \
    apt-get install -y locales && \
    echo ja_JP.UTF-8 UTF-8 > /etc/locale.gen && \
    locale-gen ja_JP.UTF-8 && \
    update-locale LANG=ja_JP.UTF-8

ENV LANG=ja_JP.UTF-8 \
    LANGUAGE=ja_JP.UTF-8 \
    LC_ALL=ja_JP.UTF-8 \
    NODE_PATH=/usr/local/lib/node_modules

RUN mkdir /usr/local/src/typescript && \
    chown node /usr/local/src/typescript && \
    chmod 755 /usr/local/src/typescript

WORKDIR /usr/local/src/typescript
RUN chown -R node:node .

USER node

RUN npm install

CMD npm start


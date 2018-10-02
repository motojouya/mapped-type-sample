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

RUN npm install -g forever && \
    npm install -g babel-cli && \
    npm install -g babel-core && \
    npm install -g uglify-js && \
    npm install -g webpack && \
    npm install -g eslint && \
    npm install -g parcel && \
    npm install -g typescript && \
    mkdir /usr/local/src/tabinote && \
    chown node /usr/local/src/tabinote && \
    chmod 755 /usr/local/src/tabinote

WORKDIR /usr/local/src/tabinote
RUN chown -R node:node .

USER node

RUN npm install

CMD npm start


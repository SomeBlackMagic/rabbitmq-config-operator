FROM node:22-alpine3.20

RUN apk update && \
    apk upgrade && \
    apk add bash

SHELL ["/bin/bash"]

#ENV NODE_OPTIONS="--enable-source-maps -r tsconfig-paths/register"
ENV NODE_OPTIONS="--enable-source-maps"
FROM quay.io/ukhomeofficedigital/nodejs-base:v4.4.2

RUN mkdir /public
RUN yum clean all && \
  yum update -y -q && \
  yum clean all && \
  rpm --rebuilddb && \
  npm --loglevel warn install -g npm@3

COPY package.json /app/package.json
RUN npm cache clean
RUN npm --loglevel warn install --production --no-optional
COPY . /app

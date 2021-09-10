FROM node:14-alpine as builder
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL ${REACT_APP_API_URL}

WORKDIR /react-app
COPY ./ /react-app

RUN npm install
RUN npm run build

FROM nginx:1-alpine
COPY --chown=82:82 --from=builder /react-app/build /var/www/react-app
COPY ./docker/prod/default.conf /etc/nginx/conf.d/default.conf

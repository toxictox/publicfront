FROM node:14-alpine as builder
WORKDIR /react-app
COPY ./ /react-app

# Install eslint
RUN npm install eslint \
    babel-eslint \
    eslint-plugin-destructuring \
    eslint-plugin-import \
    eslint-plugin-react
# Run eslint
RUN node_modules/.bin/eslint --ext .js src || true

RUN npm install
RUN npm run build

FROM nginx:1-alpine
COPY --chown=82:82 --from=builder /react-app/build /var/www/react-app
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf

#!/usr/bin/env bash

# Set variables for localhost
export CI_COMMIT_REF_NAME=${CI_COMMIT_REF_NAME='latest'}
export CI_REGISTRY_IMAGE=${CI_REGISTRY_IMAGE='local_registry/local'}
export VIRTUAL_HOST=${VIRTUAL_HOST='stage.local'}
export COMPOSE_FILE=${COMPOSE_FILE='docker/docker-compose.yml'}
export COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME='local_project'}

build() {
    cp $1 .env
    docker-compose build
    docker-compose push
}

deploy() {
    cp $1 .env
    docker-compose pull
    docker-compose down --volumes --rmi local
    docker-compose up --detach --remove-orphans
}

if [ -n "$1" ]; then
    if [ "$1" == "build_stage" ]; then
        build .env.stage
        build
    elif [ "$1" == "deploy_stage" ]; then
        deploy .env.stage
        deploy
    elif [ "$1" == "build_prod" ]; then
        build .env.prod
    elif [ "$1" == "deploy_prod" ]; then
        deploy .env.stage
    elif [ "$1" == "destroy" ]; then
        docker rm -fv $(docker ps -q --filter label=com.docker.compose.project=${DOCKER_PROJECT})
        docker network prune --force
        docker volume prune --force
    else
        echo "WRONG ARGUMENT!"
    fi
else
    # local
    docker network create nginx-proxy_stages > /dev/null 2>&1
    cp .env.stage .env
    docker-compose build
    docker-compose down --volumes --rmi local
    docker-compose up --detach --remove-orphans
    echo https://$VIRTUAL_HOST
fi

#!/bin/bash
set -e

cd /home/ubuntu/nextjs_better_auth_cognito

echo "Stopping existing containers..."
docker compose --env-file .env.production down || true

echo "Deploying image: $REPOSITORY_URI:$IMAGE_TAG"

echo "Loading image metadata..."
source image.env

echo "Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION \
  | docker login --username AWS \
  --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

echo "Pulling image: $REPOSITORY_URI:$IMAGE_TAG"
docker pull $REPOSITORY_URI:$IMAGE_TAG

echo "Updating docker-compose env..."
if [ ! -f .env.production ]; then
  touch .env.production
fi

sed -i "s|^IMAGE_URI=.*|IMAGE_URI=$REPOSITORY_URI:$IMAGE_TAG|" .env.production || true
echo "IMAGE_URI=$REPOSITORY_URI:$IMAGE_TAG" >> .env.production

echo "Starting containers..."
docker compose --env-file .env.production up -d

echo "Deployment completed successfully 🚀"
#!/bin/bash
set -e

cd /home/ubuntu/nextjs_better_auth_cognito

# Source the variables created during build
if [ -f deploy.env ]; then
    source deploy.env
fi

echo "Stopping existing containers..."
docker compose --env-file .env.production down

echo "Deploying image: $REPOSITORY_URI:$IMAGE_TAG"

echo "Logging into ECR..."
# aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $REPOSITORY_URI
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 412806877814.dkr.ecr.us-west-2.amazonaws.com

echo "Updating docker-compose env..."
if [ ! -f .env.production ]; then
  touch .env.production
fi

sed -i "s|^IMAGE_URI=.*|IMAGE_URI=$REPOSITORY_URI:$IMAGE_TAG|" .env.production || true
echo "IMAGE_URI=$REPOSITORY_URI:$IMAGE_TAG" >> .env.production

echo "Starting containers..."
docker compose --env-file .env.production up -d

echo "Deployment completed successfully 🚀"
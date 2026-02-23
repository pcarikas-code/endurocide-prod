#!/bin/bash

# Build the Docker image for UAT
echo "Building Docker image for UAT..."
docker build -t endurocide-uat .

# Stop and remove existing UAT container if it exists
echo "Stopping existing UAT container..."
docker stop endurocide-uat || true
docker rm endurocide-uat || true

# Check if port 3002 is still in use by ANY container
echo "Checking for port 3002 conflicts..."
CONFLICTING_CONTAINER=$(docker ps -q --filter "publish=3002")

if [ -n "$CONFLICTING_CONTAINER" ]; then
  echo "Found conflicting container: $CONFLICTING_CONTAINER"
  echo "Stopping conflicting container..."
  docker stop $CONFLICTING_CONTAINER
  docker rm $CONFLICTING_CONTAINER
  echo "Stopped conflicting container."
else
  echo "No conflicting containers found on port 3002."
fi

# Run new UAT container
echo "Starting new UAT container..."
docker run -d \
  --name endurocide-uat \
  --restart unless-stopped \
  -p 3002:3000 \
  endurocide-uat

echo "UAT Deployment complete! App running on port 3002"

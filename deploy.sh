#!/bin/bash

# Stop and remove existing container if it exists
echo "Stopping existing container..."
docker stop endurocide-next || true
docker rm endurocide-next || true

# Check if port 3001 is still in use by ANY container
echo "Checking for port 3001 conflicts..."
CONFLICTING_CONTAINER=$(docker ps -q --filter "publish=3001")

if [ -n "$CONFLICTING_CONTAINER" ]; then
  echo "Found conflicting container: $CONFLICTING_CONTAINER"
  echo "Stopping conflicting container..."
  docker stop $CONFLICTING_CONTAINER
  docker rm $CONFLICTING_CONTAINER
  echo "Stopped conflicting container."
else
  echo "No conflicting containers found on port 3001."
fi

# Run new container
echo "Starting new container..."
docker run -d \
  --name endurocide-next \
  --restart unless-stopped \
  -p 3001:3000 \
  endurocide-next

echo "Deployment complete! App running on port 3001"

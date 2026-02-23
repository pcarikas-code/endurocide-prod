#!/bin/bash

# Stop and remove existing container if it exists
echo "Stopping existing container..."
docker stop endurocide-next || true
docker rm endurocide-next || true

# Check if port 3000 is still in use
if lsof -i :3000 > /dev/null; then
  echo "Port 3000 is still in use by:"
  lsof -i :3000
  echo "Attempting to stop conflicting container..."
  # Find container ID using port 3000
  CONTAINER_ID=$(docker ps -q --filter "publish=3000")
  if [ -n "$CONTAINER_ID" ]; then
    docker stop $CONTAINER_ID
    docker rm $CONTAINER_ID
    echo "Stopped conflicting container: $CONTAINER_ID"
  else
    echo "Could not identify conflicting container. Please check manually."
    exit 1
  fi
fi

# Run new container
echo "Starting new container..."
docker run -d \
  --name endurocide-next \
  --restart unless-stopped \
  -p 3000:3000 \
  endurocide-next

echo "Deployment complete!"

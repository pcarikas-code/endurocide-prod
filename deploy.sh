#!/bin/bash
# Stop and remove existing container if it exists
docker stop endurocide-next || true
docker rm endurocide-next || true

# Run new container
docker run -d \
  --name endurocide-next \
  --restart unless-stopped \
  -p 3000:3000 \
  endurocide-next

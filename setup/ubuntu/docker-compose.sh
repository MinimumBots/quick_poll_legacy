#!/bin/bash

echo "# Install docker-compose."
echo "----------------------------------------------------------------"
sudo curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
echo "----------------------------------------------------------------"

docker-compose -v
echo "----------------------------------------------------------------"

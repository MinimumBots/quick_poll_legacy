#!/bin/bash

echo "# Fetch new a commit of Quick Poll."
echo "----------------------------------------------------------------"
git pull origin master
echo "----------------------------------------------------------------"

echo "# Build a image of Quick Poll."
echo "----------------------------------------------------------------"
sudo docker-compose build --no-cache
echo "----------------------------------------------------------------"

echo "# Stop the service of Quick Poll."
sudo systemctl stop quick_poll
echo "----------------------------------------------------------------"

echo "# Recreate the container of Quick Poll."
echo "----------------------------------------------------------------"
sudo docker-compose up --no-start
echo "----------------------------------------------------------------"

echo "# Restart the service of Quick Poll."
echo "----------------------------------------------------------------"
sudo systemctl start quick_poll
echo "----------------------------------------------------------------"

echo "# Remove an unused images of Docker."
echo "----------------------------------------------------------------"
sudo docker image prune -f
echo "----------------------------------------------------------------"

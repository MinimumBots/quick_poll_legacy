#!/bin/bash

echo "# Fetch new a commit of Quick Poll."
echo "----------------------------------------------------------------"
git pull origin master
echo "----------------------------------------------------------------"

echo "# Build a image of Quick Poll."
echo "----------------------------------------------------------------"
docker-compose build --no-cache
echo "----------------------------------------------------------------"

echo "# Stop the service of Quick Poll."
sudo service quick_poll stop
echo "----------------------------------------------------------------"

echo "# Recreate the container of Quick Poll."
echo "----------------------------------------------------------------"
docker-compose up --no-start
echo "----------------------------------------------------------------"

echo "# Restart the service of Quick Poll."
echo "----------------------------------------------------------------"
sudo service quick_poll start
echo "----------------------------------------------------------------"

echo "# Remove an unused images of Docker."
echo "----------------------------------------------------------------"
docker image prune -f
echo "----------------------------------------------------------------"

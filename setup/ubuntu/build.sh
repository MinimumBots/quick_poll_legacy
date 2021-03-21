#!/bin/bash

echo "# Build a image of Quick Poll."
echo "----------------------------------------------------------------"
docker-compose build --no-cache
echo "----------------------------------------------------------------"

echo "# Recreate the container of Quick Poll."
echo "----------------------------------------------------------------"
docker-compose up --no-start
echo "----------------------------------------------------------------"

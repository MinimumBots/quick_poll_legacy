#!/bin/bash

echo "# Install docker."
echo "----------------------------------------------------------------"
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt update
apt-cache policy docker-ce
sudo apt install docker-ce
echo "----------------------------------------------------------------"

echo "# Add user to docker group."
echo "----------------------------------------------------------------"
sudo usermod -aG docker ${USER}
sudo su - ${USER}
id -nG
sudo usermod -aG docker ${USER}
echo "----------------------------------------------------------------"

docker -v
echo "----------------------------------------------------------------"

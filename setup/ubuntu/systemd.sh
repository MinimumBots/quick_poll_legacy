#!/bin/bash

CURRENT_PATH=`pwd`
DOCKER_COMPOSE_PATH=`which docker-compose`

echo "# Add BOT to service."
echo "----------------------------------------------------------------"
echo "[Unit]
Description=Quick Poll, a quick voting bot for Discord.
Requires=docker.service
After=network-online.target

[Service]
WorkingDirectory=$CURRENT_PATH
ExecStart=$DOCKER_COMPOSE_PATH up --no-recreate
ExecStop=$DOCKER_COMPOSE_PATH stop

[Install]
WantedBy=network-online.target" | sudo tee /etc/systemd/system/quick_poll.service
echo "----------------------------------------------------------------"

echo "# Enable the service."
echo "----------------------------------------------------------------"
sudo systemctl enable systemd-networkd
sudo systemctl enable systemd-networkd-wait-online
sudo systemctl daemon-reload
sudo systemctl enable quick_poll
echo "----------------------------------------------------------------"

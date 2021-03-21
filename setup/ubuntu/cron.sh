#!/bin/bash

echo "# Register the reboot cron."
echo "----------------------------------------------------------------"
echo "0 4 * * * /usr/sbin/shutdown -r now" | sudo tee /etc/cron.d/everyday_reboot

sudo service cron restart
echo "----------------------------------------------------------------"

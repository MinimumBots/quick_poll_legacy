#!/bin/bash

SHUTDOWN_PATH=`which shutdown`

echo "# Register daily reboots service to systemd."
echo "----------------------------------------------------------------"
echo "[Unit]
Description=Reboot the system.

[Service]
Type=simple
ExecStart=/usr/bin/systemctl --force reboot
" | sudo tee /etc/systemd/system/daily_reboots.service
echo "----------------------------------------------------------------"

echo "# Register daily reboots timer to systemd."
echo "----------------------------------------------------------------"
echo "[Unit]
Description=Reboot the system at 4 o'clock daily.

[Timer]
Unit=daily_reboots.service
OnCalendar=*-*-* 4:00:00

[Install]
WantedBy=timers.target
" | sudo tee /etc/systemd/system/daily_reboots.timer
echo "----------------------------------------------------------------"

echo "# Enable daily reboots."
echo "----------------------------------------------------------------"
sudo systemctl daemon-reload
sudo systemctl enable daily_reboots
sudo systemctl enable daily_reboots.timer
echo "----------------------------------------------------------------"

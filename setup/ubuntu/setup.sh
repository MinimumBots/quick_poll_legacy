#!/bin/bash

RELATIVE_PATH=`dirname $0`

$RELATIVE_PATH/docker.sh
$RELATIVE_PATH/docker-compose.sh
$RELATIVE_PATH/systemd.sh
$RELATIVE_PATH/cron.sh

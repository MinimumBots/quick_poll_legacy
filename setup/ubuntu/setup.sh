#!/bin/bash

CURRENT_PATH=`pwd`
cd `dirname $0`
DIR_PATH=`pwd`
cd CURRENT_PATH

$DIR_PATH/docker.sh
$DIR_PATH/docker-compose.sh
$DIR_PATH/build.sh
$DIR_PATH/systemd.sh
$DIR_PATH/cron.sh

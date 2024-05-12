#!/bin/bash

echo 'run application_start.sh: ' >> /home/ubuntu/repairfind-be/deploy.log

echo 'pm2 restart repairfind-backend' >> /home/ubuntu/repairfind-be/deploy.log
sudo pm2 restart repairfind-backend >> /home/ubuntu/repairfind-be/deploy.log

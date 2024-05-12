#!/bin/bash
echo 'run after_install.sh: ' >> /home/ubuntu/repairfind-be/deploy.log

echo 'cd /home/ubuntu/repairfind-be' >> /home/ubuntu/repairfind-be/deploy.log
cd /home/ubuntu/repairfind-be >> /home/ubuntu/repairfind-be/deploy.log

echo 'npm install' >> /home/ubuntu/repairfind-be/deploy.log
npm install >> /home/ubuntu/repairfind-be/deploy.log


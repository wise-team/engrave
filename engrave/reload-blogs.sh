#!/bin/bash 

# Copy all necessary files from blog template to every running blog on platform

for i in $(find instances/ -maxdepth 1 ! -path instances/ -type d);
do
    BLOG=$(echo $i | sed 's#instances/##'); # pm2 process is equal to directory name but without trailing dot and slash
    echo $BLOG;
    sudo pm2 reload $BLOG # restart blog instance
done
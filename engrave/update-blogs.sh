#!/bin/bash 

# Copy all necessary files from blog template to every running blog on platform
# It does not reload PM2 apps. Can be used when only visual fixes are made

for i in $(find instances/ -maxdepth 1 ! -path instances/ -type d);
do
    BLOG=$(echo $i | sed 's#instances/##'); # pm2 process is equal to directory name but without trailing dot and slash
    echo $BLOG;
    sudo cp -r blog/* $i/; # copy all files
done
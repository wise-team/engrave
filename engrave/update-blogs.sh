#!/bin/bash 

# Copy all necessary files from blog template to every running blog on platform
# It does not reload PM2 apps. Can be used when only visual fixes are made

for i in $(find pm2_blogs/ -maxdepth 1 ! -path pm2_blogs/ -type d);
do
    BLOG=$(echo $i | sed 's#pm2_blogs/##'); # pm2 process is equal to directory name but without trailing dot and slash
    echo $BLOG;
    sudo cp -r blog_app_template/* $i/; # copy all files
done
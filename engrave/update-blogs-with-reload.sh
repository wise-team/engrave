#!/bin/bash 

# Copy all necessary files from blog template to every running blog on platform

for i in $(find pm2_blogs/ -maxdepth 1 ! -path pm2_blogs/ -type d);
do
    BLOG=$(echo $i | sed 's#pm2_blogs/##'); # pm2 process is equal to directory name but without trailing dot and slash
    echo $BLOG;
    sudo cp -r blog_app_template/* $i/; # copy all files
    sudo pm2 reload $BLOG # restart blog instance
done
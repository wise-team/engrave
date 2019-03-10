# Engrave

## Steem powered blogging platform

Engrave is a native blogging platform with a completely different approach. You can create a blockchain powered website in just a few seconds with your own desired domain. You can choose your website's design from modern and nice-looking templates with integrated Steemconnect. Your readers can vote and comment on your articles directly from your blog to make it worth more. Engrave helps hobbyists to create their own blogs on Steem, build an audience and monetize almost every legal content easily. Encouraging readers was never easier because of great and dynamically growing Steem userbase. With our help, you can build own blog and reach valuable readers to earn on your content without having skills other than writing!

Engrave is an open-source software and we are open for any kind of contributions. 

# Development

To run Engrave locally you need to have Docker engine installed. If you're running Engrave for the first time, make sure you have docker swarm initialized. If not (or you are not sure), just initialize it with `docker swarm init`.

1. Clone the repository with: `git clone https://github.com/wise-team/engrave.git`

2. Initialize git submodules with `git submodule init`

3. Checkout submodules with `git submodule update`

4. Add necessary docker secrets (api keys, etc) with:

```
echo "name.com api username" | sudo docker secret create NAMECOM_USERNAME -
echo "name.com api token" | sudo docker secret create NAMECOM_TOKEN -
echo "imgur project key" | sudo docker secret create IMGUR_KEY -
echo "imgur client id" | sudo docker secret create IMGUR_CLIENT_ID -
echo "steemconnect app secret" | sudo docker secret create SC2_APP_SECRET -
echo "jwt secret" | sudo docker secret create JWT_SECRET -
echo "vault token" | sudo docker secret create VAULT_TOKEN -
echo "mailgun domain" | sudo docker secret create MAILGUN_DOMAIN -
echo "mailgun api key" | sudo docker secret create MAILGUN_API_KEY -
```

5. Build development images with `./development-deploy.sh`

**Note**: for development purposes, you can add invalid secrets. Just some functions won't work (like commenting and voting on locally set up blogs). You can always remove entire stack and manipulate secrets at any moment.

6. After your work is done, you can remove Engrave stack with: `docker stack rm engrave`

***

# Frequently Asked Questions and problems

1. ```fatal: No url found for submodule path 'engrave-vault-connector/src/submodules/engrave-shared' in .gitmodules```
 
You need to initialize git submodules with `git submodule init` in project root directory. Type also `git submodule update` just to make sure that every submodule is checked out properly.

***

# Production deployment

## Requesting wildcard SSL certificate

Befor running ENGRAVE system on production you need to request wildcard certificate. Otherwise nginx deamon wouldn't start because he's serving SSL files for default. Requesting that kind of certificate requires DNS records to be changes during process. You need to do it manually because it's depends on your domain registrar. We prepared interactive script to do it with your help:

`./request_wildcard_certificate.sh engrave.website`

It will ask you for some questions and if everything is ok, wildcard certificate for `engrave.website` certificate will be generated.

## Running ENGRAVE

In order to enable domain buying with STEEM or SBD, you need to add some sensitive informations as docker secrets. You can find all necessary data [here](https://www.name.com/account/settings/api).

```
echo "name.com api username" | sudo docker secret create NAMECOM_USERNAME -
echo "name.com api token" | sudo docker secret create NAMECOM_TOKEN -
echo "imgur project key" | sudo docker secret create IMGUR_KEY -
echo "imgur client id" | sudo docker secret create IMGUR_CLIENT_ID -
echo "steemconnect app secret" | sudo docker secret create SC2_APP_SECRET -
echo "jwt secret" | sudo docker secret create JWT_SECRET -
echo "vault token" | sudo docker secret create VAULT_TOKEN -
echo "mailgun domain" | sudo docker secret create MAILGUN_DOMAIN -
echo "mailgun api key" | sudo docker secret create MAILGUN_API_KEY -
```

If you generated SSL certificate, you can run ENGRAVE system. Inspect `docker-compose.yml` file for environmental variables and then just type:

`./development-deploy.sh`

It will create docker stack with engrave and nginx on top. It should just work out of the box. 

If you want to deploy production setup you can use:

```
./images-build-engrave.sh
./production-deploy.engrave.sh
```

or

```
./images-build-dblog.sh
./production-deploy.dblog.sh
```

But be very very carefully! It will really deploy production setup!

# Engrave

## Steem powered blogging platform

Aren't you bored by investing your work and time in creating non-returning blog or website? Start making money easily by just posting high quality articles. ENGRAVE is free and easy to use. You can choose your website's design from 3 modern and nice-looking templates. You won't pay anything unless you earn something. And if so, everything will be settled-up automatically!

# Installation

## Requesting wildcard SSL certificate

Befor running ENGRAVE system on production you need to request wildcard certificate. Otherwise nginx deamon wouldn't start because he's serving SSL files for default. Requesting that kind of certificate requires DNS records to be changes during process. You need to do it manually because it's depends on your domain registrar. We prepared interactive script to do it with your help:

`./request_wildcard_certificate.sh engrave.website`

It will ask you for some questions and if everything is ok, wildcard certificate for `engrave.website` certificate will be generated.

## Running ENGRAVE

In order to enable domain buying with STEEM or SBD, you need to add some sensitive informations as docker secrets. You can find all necessary data [here](https://www.name.com/account/settings/api).

```
echo "<name.com api username>" | sudo docker secret create NAMECOM_USERNAME -
echo "<name.com api token>" | sudo docker secret create NAMECOM_TOKEN -
echo "<imgur project key>" | sudo docker secret create IMGUR_KEY -
echo "<imgur client id>" | sudo docker secret create IMGUR_CLIENT_ID -
echo "steemconnect app secret" | sudo docker secret create SC2_APP_SECRET -
echo "jwt secret" | sudo docker secret create JWT_SECRET -
echo "vault token" | sudo docker secret create VAULT_TOKEN -
```

If you generated SSL certificate, you can run ENGRAVE system. Inspect `docker-compose.yml` file for environmental variables and then just type:

`./development-deploy.sh`

It will create docker stack with engrave and nginx on top. It should just work out of the box. If you want to deploy production setup you can use:

`./production-deploy.engrave.sh`

or

`./production-deploy.dblog.sh`

But be very very carefully! It will really deploy production setup!

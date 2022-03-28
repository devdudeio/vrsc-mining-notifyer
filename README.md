# vrsc-mining-notifyer
## description

![image](https://raw.githubusercontent.com/devdudeio/vrsc-mining-notifyer/main/docs/image.png)


The vrsc-mining-notifyer checks every 5 minutes if one of your veruscoin miners from luckpool is down. If there is something to report a discord message will be thrown via webhook.

node application will run in a [docker](https://www.docker.com/) container using [pm2](https://pm2.keymetrics.io/)

very easy to customize ;)

## how to use
### build docker image
$ `docker build -t vrsc-mining-notifyer .`

### run detached container and set env vars
$ `docker run -d -e "ADDRESS=YOUR-ADDRESS" -e "DISCORD_WEBHOOK_URL=YOUR-WH-URL" vrsc-mining-notifyer`
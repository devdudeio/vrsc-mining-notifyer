const { WebhookClient } = require('discord.js');
const { prototype } = require('events');
const axios = require('axios').default;

const envs = {
    DISCORD_WEBHOOK_URL: "DISCORD_WEBHOOK_URL",
    ADDRESS: "ADDRESS",    
}

const checkEnvs = () => {
    let missingEnv =  false;
    Object.keys(envs).forEach(env => {
        if(!process.env[env]){
            console.error(`Please set env for ${env} like:`)
            console.error(`export ${env}=YOUR_VALUE\n`)
            missingEnv = true;
        }
    })
    if(missingEnv) process.exit();
}

const fetchWorkers = async (addr) => {
    try {
        return await axios.get(`https://luckpool.net/verus/miner/${addr}`).then(response => {
        
        if(response.data.error){
            throw new Error(response.data.error)
        }

        return response.data
        });
      } catch (error) {
        console.error(error);
        process.exit();
      }
}

const findDownWorkers = (response) => {
    let downWorkerList = [];    
    response.workers.forEach(worker => {
       if(worker.split(':')[3] === 'off'){
        downWorkerList.push(worker);   
       } 
    });
    return downWorkerList;
}

const sendWebhook = async (response) => {
    const webhookClient = new WebhookClient({ url:`${process.env.DISCORD_WEBHOOK_URL}` });
    const downWorkerList = findDownWorkers(response);
    await webhookClient.send({
        embeds: [
            {
              "type": "rich",
              "title": `Miners down!`,
              "description": `It seems like some of your miners are down.`,
              "color": 0xff0095,
              "fields": [
                {
                  "name": `Miners Down`,
                  "value": `\`${downWorkerList.map(downWorker => downWorker.split(':')[0]).join('\`, \`')}\``,
                  "inline": true
                },
                {
                  "name": `current hashrate`,
                  "value": `${response.hashrateString}`,
                  "inline": true
                },
                {
                    "name": `immmature`,
                    "value": `${response.immature}`,
                    "inline": true
                  },
                  {
                    "name": `balance`,
                    "value": `${response.balance}`,
                    "inline": true
                  }
              ],
              "timestamp": `${new Date()}`,
              "url": `https://luckpool.net/verus/miner.html?${process.env[envs.DISCORD_WEBHOOK_URL]}`
            }
          ]
      })
        .catch(console.error);
}


(async () => {
    checkEnvs();
    const response = await fetchWorkers(`${process.env.ADDRESS}`)
    const totalDownWorkers = findDownWorkers(response).length;

    if(totalDownWorkers > 0){
        console.debug(`${new Date()}:`, `looks like there is a problem with ${totalDownWorkers} worker(s)`)
        await sendWebhook(response);
        process.exit();
    }

    console.debug(Date.now(), 'everything is fine')
    process.exit();
})()

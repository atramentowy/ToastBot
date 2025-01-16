const fs = require('fs')
const path = require('path')

const mineflayer = require('mineflayer')
// const hawkeye = require('minecrafthawkeye').default;
const minecraftHawkEye = require('minecrafthawkeye').default

const pathfinder = require('mineflayer-pathfinder')
const armorManager = require('mineflayer-armor-manager')
const pvp = require('mineflayer-pvp').plugin
// const mcDataLoader = require('minecraft-data')  // Import minecraft-data

let botArgs = {
    host: 'localhost',
    port: '25565',
};

function injectModules(bot) {
  const MODULES_DIR = path.join(__dirname, 'modules')
  const modules = fs
    .readdirSync(MODULES_DIR) // find the plugins
    .filter(x => x.endsWith('.js')) // only use .js files
    .map(pluginName => require(path.join(MODULES_DIR, pluginName)))

  bot.loadPlugins(modules)
}

class MCBot {
    constructor(username) {
        this.username = username;
        this.host = botArgs["host"];
        this.port = botArgs["port"];

        this.initBot();
    }

    initBot() {
        this.bot = mineflayer.createBot({
            "username": this.username,
            "host": this.host,
            "port": this.port,
            "version": this.version
        });

        this.bot.loadPlugin(pathfinder.pathfinder);
        this.bot.loadPlugin(minecraftHawkEye)
        this.bot.loadPlugin(armorManager);
        this.bot.loadPlugin(pvp);

        injectModules(this.bot)

        this.initEvents()
    }

    initEvents() {
        this.bot.on('login', () => {
            let botSocket = this.bot._client.socket;
            console.log(`[${this.username}] Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`);
        });

        this.bot.on('end', (reason) => {
            console.log(`[${this.username}] Disconnected: ${reason}`);
    
            if (reason == "disconnect.quitting") {
                return
            }
    
            // Attempt to reconnect
            setTimeout(() => this.initBot(), 5000);
        });

        this.bot.on('spawn', async () => {      
          // movement setup
          const defaultMove = new pathfinder.Movements(this.bot);
          defaultMove.allowParkour = true;
          defaultMove.allowSprinting = true;
          defaultMove.allow1by1towers = true;
          defaultMove.canDig = true;
          defaultMove.dontMineUnderFallingBlock = true;
          defaultMove.canOpenDoors = true;

          console.log(`[${this.username}] Spawned in`);
          this.bot.chat("Hello!");

          const prefix = '.';
  
          // await this.bot.waitForTicks(60);
          // this.bot.chat("Goodbye");
          // 

          this.bot.on('chat', (username, message) => {
            if(username === this.bot.username) return;
            if(message === 'come') {
              const RANGE_GOAL = 2;
              const target = this.bot.players[username].entity;
              if (!target) {
                this.bot.chat("I dont see you");
                return
              }
              const {x: playerX, y: playerY, z:playerZ } = target.position;

              this.bot.pathfinder.setMovements(defaultMove);
              this.bot.pathfinder.setGoal(new pathfinder.goals.GoalNear(playerX, playerY, playerZ, RANGE_GOAL));
            }
            if (message === 'quit') {
              this.bot.quit();
            }

            if(message == 'stop') {
              this.bot.pathfinder.setGoal(null)
            }
          })
        });

        this.bot.on('error', (err) => {
            if (err.code == 'ECONNREFUSED') {
                console.log(`[${this.username}] Failed to connect to ${err.address}:${err.port}`)
            }
            else {
                console.log(`[${this.username}] Unhandled error: ${err}`);
            }
        });
    }
}

let bots = [];
for(var i = 0; i < 5; i++) {
    bots.push(new MCBot(`Toast_${i}`))
}
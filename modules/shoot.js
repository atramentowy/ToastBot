const mineflayer = require('mineflayer')
const minecraftHawkEye = require('minecrafthawkeye');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const pvp = require('mineflayer-pvp').plugin


module.exports = bot => {
    function dodge() {
        bot.setControlState('jump', true)
        bot.waitForTicks(30)

        bot.setControlState('jump', false)
    }

    function getNearestPlayer() {
        let nearestPlayer = null;
        let shortestDistance = Infinity; // Start with a very large distance
    
        // Loop through all players in the bot's world
        for (const playerName in bot.players) {
            const player = bot.players[playerName];
    
            // Ensure the player is online and within range
            if (player && player.entity) {
                const distance = bot.entity.position.distanceTo(player.entity.position);
                
                // If this player is closer than the previously found player, update nearestPlayer
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    nearestPlayer = player;
                }
            }
        }
    
        return nearestPlayer;
    }

    bot.on('chat', async (username, message) => {
        if(username === bot.username) return;
        if(message === 'radar') {
            bot.hawkEye.startRadar()
        }
        if(message === 'radar off') {
            bot.hawkEye.stopRadar()
        }
        if(message === 'shoot') {

        }
    })


}
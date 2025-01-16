const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const pvp = require('mineflayer-pvp').plugin;

module.exports = bot => {
    let guardPos = null
    function guardArea(pos) {
        guardPos = pos
        if (!bot.pvp.target) {
            moveToGuardPos()
        }
    }

    function stopGuarding() {
        moveToGuardPos()
        guardPos = null
        bot.pvp.stop()
        bot.pathfinder.setGoal(null)
    }

    function moveToGuardPos() {
        bot.pathfinder.setMovements(new Movements(bot))
        bot.pathfinder.setGoal(new goals.GoalBlock(guardPos.x, guardPos.y, guardPos.z))
    }

    bot.on('stoppedAttacking', () => {
        if (guardPos) {
            moveToGuardPos()
        }
    })

    bot.on('physicsTick', () => {
        if(!guardPos) return
        const filter = e => e.type === 'mob' && e.position.distanceTo(bot.entity.position) < 16 &&
        e.displayName !== 'Armor Stand' // Mojang classifies armor stands as mobs lol

        const entity = bot.nearestEntity(filter)
        if (entity) {
            bot.pvp.attack(entity)
        }
    })

    bot.on('chat', (username, message) => {
        // guard the location the player is standing
        if(message === 'guard') {
            const player = bot.players[username]

            if(!player) {
                bot.chat('I cant see you')
                return
            }

            bot.chat('Guarding the location')
            const guardPos = player.entity.position;
            guardArea(guardPos)
        }

        if(message === 'guard stop') {
            bot.chat('Stopping')
            stopGuarding()
        }
    })
}
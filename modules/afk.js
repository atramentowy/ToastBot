const mineflayer = require('mineflayer')

module.exports = bot => {
    let rotater
    let rotated = false
    bot.afk = {}

    bot.afk.start = () => {
        if(rotater) return
        rotater = setInterval(rotated, 3000)
    }

    bot.afk.stop = () => {
        if(!rotater) return
        clearInterval(rotater)
    }

    function rotate() {
        bot.look(rotated ? 0 : Math.PI, 0)
        rotated = !rotated
    }
}
const { Bot } =  require('viber-bot')
const Logger = require('../logger.js')
const { VIBER_BOT_TOKEN } = require('../config.js')
const useBotLogic = require('./logic.js')

// Create viber-bot Bot instance
const bot = new Bot(Logger, {
    authToken: VIBER_BOT_TOKEN,
    name: 'Inbox Bot',
    avatar: 'https://www.pngitem.com/pimgs/m/122-1223088_one-bot-discord-avatar-hd-png-download.png'
})

// Implement hook logic for a bot
useBotLogic(bot)

module.exports = bot
import { Bot } from 'viber-bot'
import Logger from '../logger.js'
import { VIBER_BOT_TOKEN } from '../config.js'
import useBotLogic from './logic.js'

// Create viber-bot Bot instance
const bot = new Bot(Logger, {
    authToken: VIBER_BOT_TOKEN,
    name: 'Inbox Bot',
    avatar: 'https://www.pngitem.com/pimgs/m/122-1223088_one-bot-discord-avatar-hd-png-download.png'
})

// Implement hook logic for a bot
useBotLogic(bot)

export default bot
import http from 'http'
import { PORT } from '../config.js'
import { connectToMailServer } from '../mail/client.js'

// Get PORT or set it to 8080
export const _PORT = PORT || 8080

// Create server helper function
export const createServer = (bot, WEBHOOK_URL) => {
    http.createServer(bot.middleware().listen(_PORT, () => {
        connectToMailServer()
        bot.setWebhook(WEBHOOK_URL)
    }))
}
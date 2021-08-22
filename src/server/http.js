const http = require('http')
const { PORT } = require('../config.js')
const { connectToMailServer } = require('../mail/client.js')

// Get PORT or set it to 8080
const _PORT = PORT || 8080

// Create server helper function
const createServer = (bot, WEBHOOK_URL) => {
    http.createServer(bot.middleware().listen(_PORT, () => {
        connectToMailServer()
        bot.setWebhook(WEBHOOK_URL)
        console.log('Server started!')
    }))
}

module.exports = { _PORT, createServer }
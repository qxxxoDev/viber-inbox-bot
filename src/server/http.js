const app = require('express')()
const { PORT } = require('../config.js')
const { connectToMailServer } = require('../mail/client.js')

// Get PORT or set it to 8080
const _PORT = PORT || 8080

// Create server helper function
const createServer = (bot, WEBHOOK_URL) => {
    app.use('/viber/webhook', bot.middleware())

    app.get('/', (req, res) => {
        res.send('<p>This is a server for Viber Inbox Bot made by</p><a href="mailto:tigranzalian595@gmail.com">Tigran Zalian</a>')
        console.log('Keeping alive...')
    })

    app.listen(_PORT, () => {
        connectToMailServer()
        bot.setWebhook(`${WEBHOOK_URL}/viber/webhook`)
        console.log('Server started!')
    })
}

module.exports = { _PORT, createServer }
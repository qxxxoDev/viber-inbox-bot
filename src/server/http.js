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

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write('Keeping alive...')
    console.log('Keeping alive...')
    res.end()
}).listen(5500, () => console.log('Keep alive server started on port 5500.'))

module.exports = { _PORT, createServer }
const { createServer } = require('./http.js')
const { exposeServer } = require('./ngrok.js')
const { DEBUG, WEBHOOK_URL } = require('../config.js')

// Create web server for bot
const startServer = async bot => {
    if (DEBUG){
        const EXPOSE_URL = await exposeServer()
        createServer(bot, EXPOSE_URL)
    } else {
        createServer(bot, WEBHOOK_URL)
    }
}

module.exports = startServer
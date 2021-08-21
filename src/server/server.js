import { createServer } from './http.js'
import { exposeServer } from './ngrok.js'
import { DEBUG, WEBHOOK_URL } from '../config.js'

// Create web server for bot
export const startServer = async bot => {
    if (DEBUG){
        const EXPOSE_URL = await exposeServer()
        createServer(bot, EXPOSE_URL)
    } else {
        createServer(bot, WEBHOOK_URL)
    }
}
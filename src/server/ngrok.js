const ngrok = require('ngrok')
const { _PORT } = require('./http.js')

// Expose local server with ngrok
const exposeServer = async () => {
    try {
        return await ngrok.connect(_PORT)
    } catch (e) {}
}

module.exports = { exposeServer }
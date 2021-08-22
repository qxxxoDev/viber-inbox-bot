const ngrok = require('ngrok')
const { _PORT } = require('./http.js')

// Expose local server with ngrok
const exposeServer = async () => {
    return await ngrok.connect(_PORT)
}

module.exports = { exposeServer }
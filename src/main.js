const startServer = require('./server/server.js')
const bot = require('./bot/bot.js')

console.log('App has been started!')

// Start server for a bot
startServer(bot)
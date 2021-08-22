const { createLogger, transports } = require('winston')

// Create Logger
module.exports = createLogger({ level: 'debug' }).add(new transports.Console)
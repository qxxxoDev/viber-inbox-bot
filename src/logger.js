import winston from 'winston'

// Destructure 'winston' package
const { createLogger, transports } = winston

// Create Logger
const Logger = createLogger({ level: 'debug' }).add(new transports.Console)

export default Logger
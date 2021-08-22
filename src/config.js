const { config } = require('dotenv')

// Get environment variables from .env file
config({path: `${process.env.PWD}/.env`})

module.exports = { ...process.env }
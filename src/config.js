import { config } from 'dotenv'

// Get environment variables from .env file
config({path: `${process.env.PWD}/.env`})

export const { 
    VIBER_BOT_TOKEN,
    DEBUG, PORT, 
    WEBHOOK_URL,
    EMAIL,
    PASSWORD,
    IMAP_HOST,
    SECRET_KEY,
    DATABASE_URL
} = process.env
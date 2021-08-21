import ngrok from 'ngrok'
import { _PORT } from './http.js'

// Expose local server with ngrok
export const exposeServer = async () => {
    return await ngrok.connect(_PORT)
}
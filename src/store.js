import fs from 'fs'

const USER_FILE = process.env.PWD + '/src/user.json'

export const setUser = user => {
    fs.truncateSync(USER_FILE, 0)
    fs.appendFile(USER_FILE, JSON.stringify(user), (err) => {})
}

export const getUser = () => {
    return JSON.parse(fs.readFileSync(USER_FILE).toString('utf8') || '{"isSubscribed": false}')
}
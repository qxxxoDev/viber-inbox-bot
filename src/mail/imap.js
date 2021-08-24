const Imap = require('imap')

const createImap = ({ user, password, host }) => {
    return new Imap({
        user,
        password,
        host,
        port: 993,
        tls: true,
        tlsOptions: {
            rejectUnauthorized: false
        }
    })
}

module.exports = { createImap }
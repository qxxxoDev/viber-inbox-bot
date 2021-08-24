const { simpleParser } = require('mailparser')
const { emitMailReceivedEvent } = require('../events/mail.js')
const { createImap } = require('./imap.js')
const { EMAIL, PASSWORD, IMAP_HOST } = require('../config.js')


const connectToMailServer = () => {
    const imap = createImap({
        user: EMAIL,
        password: PASSWORD,
        host: IMAP_HOST
    })

    const openInbox = cb => imap.openBox('INBOX', true, cb)

    imap.once('ready', () => openInbox((err, box) => {
        if (err) throw err
        console.log('Imap connected!')

        imap.on('mail', count => {

            const from = box.messages.total - count + 1

            const f = imap.seq.fetch(from + ':*', {
                bodies: '',
                struct: true
            })

            f.on('message', msg => {
                msg.on('body', stream => {
                    simpleParser(stream, (err, mail) => {
                        if (err) throw err
                        emitMailReceivedEvent(mail)
                    })
                })
            })

        })

    }))

    imap.once('error', function(err) {
        throw err
    })

    imap.once('end', function() {
        console.log('Imap connection ended.\nReconnectiong...\n');
        connectToMailServer()
    })

    imap.connect()
}

module.exports = { connectToMailServer }
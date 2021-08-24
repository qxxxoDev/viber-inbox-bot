const { simpleParser } = require('mailparser')
const { emitMailReceivedEvent } = require('../events/mail.js')
const { createImap } = require('./imap.js')
const { EMAIL, PASSWORD, IMAP_HOST } = require('../config.js')


const imap = createImap({
    user: EMAIL,
    password: PASSWORD,
    host: IMAP_HOST
})

const openInbox = cb => imap.openBox('INBOX', true, cb)

imap.once('ready', () => openInbox((err, box) => {
    console.log('Imap is ready!')
    if (err) console.log(err)

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
  console.log(err)
})

imap.once('end', function() {
  console.log('Imap connection ended');
})

const connectToMailServer = () => imap.connect()

module.exports = { connectToMailServer }
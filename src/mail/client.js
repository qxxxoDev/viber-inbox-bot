import { simpleParser } from 'mailparser'
import { emitMailReceivedEvent } from '../events/mail.js'
import { createImap } from './imap.js'
import { EMAIL, PASSWORD, IMAP_HOST } from '../config.js'


const imap = createImap({
    user: EMAIL,
    password: PASSWORD,
    host: IMAP_HOST
})

const openInbox = cb => imap.openBox('INBOX', true, cb)

imap.once('ready', () => openInbox((err, box) => {
    if (err) throw err

    imap.on('mail', count => {

        const from = box.messages.total - count + 1

        const f = imap.seq.fetch(from + ':*', {
            bodies: '',
            struct: true
        })

        f.on('message', msg => {
            msg.on('body', stream => {
                simpleParser(stream, async (err, mail) => {
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
  console.log('Connection ended');
})

export const connectToMailServer = () => imap.connect()
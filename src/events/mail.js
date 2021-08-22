const MailEmitter = require('events')

const mailEmitter = new MailEmitter
const emitMailReceivedEvent = mail => mailEmitter.emit('mail', mail)

mailEmitter.setMaxListeners(1)

module.exports = { mailEmitter, emitMailReceivedEvent }
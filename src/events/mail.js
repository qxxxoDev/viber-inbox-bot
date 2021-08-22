import MailEmitter from 'events'

export const mailEmitter = new MailEmitter
export const emitMailReceivedEvent = mail => mailEmitter.emit('mail', mail)

mailEmitter.setMaxListeners(1)
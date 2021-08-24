const Viber = require('viber-bot')
const { mailEmitter } = require('../events/mail.js')
const { getAllAuthorizedUsers, subscribe, setUser, getAuthorizedIds, checkSub } = require('../database/store.js')

const TextMessage = Viber.Message.Text

const START_KEYBOARD = {
    "Type": "keyboard",
    "InputFieldState": "hidden",
    "Buttons": [{
        "Columns": 6,
        "Rows": 1,
        "ActionType": "reply",
        "ActionBody": "START",
        "Text": "<font size='18' color='#353b48'><b>START</b></font>",
        "BgColor": "#48dbfb",
        "TextHAlign": "center",
        "TextVAlign": "middle",
        "Silent": "true"
    }]
}

const ASK_AUTH = id => {
    const url = `mailto:tigranzalian595@gmail.com?subject=InboxBot%20-%20Auth%20Enquiry&body=${encodeURIComponent(id)}`
    return {
        "Type": "keyboard",
        "InputFieldState": "hidden",
        "Buttons": [{
            "Columns": 6,
            "Rows": 1,
            "ActionType": "open-url",
            "ActionBody": url,
            "Text": "<font size='18' color='#856404'><b>ASK</b></font>",
            "BgColor": "#fff3cd",
            "TextHAlign": "center",
            "TextVAlign": "middle",
            "Silent": "true"
        }]
    }
}

const NO_KEYBOARD = {
    "Type": "keyboard",
    "InputFieldState": "hidden",
    "Buttons": [{
        "Columns": 6,
        "Rows": 1,
        "ActionType": "none",
        "Text": "<font size='18' color='#353b48'><b>InboxBot</b></font>",
        "BgColor": "#48dbfb",
        "TextHAlign": "center",
        "TextVAlign": "middle",
        "Silent": "true"
    }]
}

const useKeyboard = keyboard => [keyboard, null, null, null, 3]

let uid

const onSubscribe = async res => {
    const msg = "Now you are subscribed!\nWait for bot to send your mails once you get them."
    res.send(new TextMessage(msg, ...useKeyboard(NO_KEYBOARD)))
    if (uid){
        try {
            await subscribe(uid, true)
        } catch (e) {}
    }
}

const useBotLogic = bot => {

    bot.onConversationStarted(async (userProfile, isSubscribed, context, onFinish) => {
        try {
            console.log(`\nUser ID: ${userProfile.id}\n`)
        
            const authorizedIds = await getAuthorizedIds()
            const checkAuth = id => authorizedIds.includes(id)

            uid = userProfile.id

            if (!checkAuth(userProfile.id)){
                const ERR_MESSAGE = new TextMessage(`Hi, ${userProfile.name}!\nYou are not authorized.\nYou can't use this bot for now.\n\nIf you are convinced that you should have access to this bot, ask for authorization`, ...useKeyboard(ASK_AUTH(userProfile.id)))
                bot.sendMessage(userProfile, ERR_MESSAGE)
                return false
            }

            await setUser(userProfile)

            if (!isSubscribed){
                const START_MESSAGE = new TextMessage(`Hi, ${userProfile.name}!\nNice to meet you!`, ...useKeyboard(START_KEYBOARD))
                try {
                    await bot.sendMessage(userProfile, START_MESSAGE)
                } catch (e) {}
            }
        } catch (e) {}
    })
    
    mailEmitter.on('mail', async mail => {
        console.log('\n\n---- Mail event fired! ----\n\n')
        try {
            const users = await getAllAuthorizedUsers()
            if (mail.subject.includes('UA')/*  && mail.from.value.address == 'notification@transporeon.com' */)
            users.forEach(async user => {
                const isSubscribed = await checkSub(user.id)
                console.log('\n\n---- Is subscribed ----\n\n', isSubscribed)
                if (isSubscribed){
                    console.log('\n\n---- Sending message... ----\n\n')
                    await bot.sendMessage(user, new TextMessage(`${mail.subject}\n\n${mail.text}`, ...useKeyboard(NO_KEYBOARD)))
                    console.log('\n\n---- Mail sent! ----\n\n')
                }
            })
        } catch (e) {}
    })

    bot.onSubscribe(res => async (msg, res) => {
        try {
            await onSubscribe(res)
        } catch (e) {}
    })

    bot.onTextMessage(/^START$/, async (msg, res) => {
        try {
            await onSubscribe(res)
        } catch (e) {}
    })

    bot.onUnsubscribe(async uid => {
        try {
            await subscribe(uid, false)
        } catch (e) {}
    })
}

module.exports = useBotLogic
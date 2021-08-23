const Viber = require('viber-bot')
const { mailEmitter } = require('../events/mail.js')
const { getUser, setUser } = require('../database/store.js')

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

const NO_KEYBOARD = {
    "Type": "keyboard",
    "InputFieldState": "hidden",
    "Buttons": [{
        "Columns": 6,
        "Rows": 1,
        "ActionType": "reply",
        "ActionBody": "no-action",
        "Text": "<font size='18' color='#353b48'><b>InboxBot</b></font>",
        "BgColor": "#48dbfb",
        "TextHAlign": "center",
        "TextVAlign": "middle",
        "Silent": "true"
    }]
}

const useKeyboard = keyboard => [keyboard, null, null, null, 3]

const onSubscribe = res => {
    const msg = "Now you are subscribed!\nWait for bot to send your mails once you get them."
    res.send(new TextMessage(msg, ...useKeyboard(NO_KEYBOARD)))
}

const useBotLogic = async bot => {

    bot.onConversationStarted(async (userProfile, isSubscribed, context, onFinish) => {
        // Set user on start
        try {
            await setUser(userProfile)
        } catch (e) {}  
        
        if (!isSubscribed){
            const START_MESSAGE = new TextMessage(`Hi, ${userProfile.name}!\nNice to meet you!`, ...useKeyboard(START_KEYBOARD))
            bot.sendMessage(userProfile, START_MESSAGE)
        }
    })

    const useMailClient = () => mailEmitter.on('mail', async mail => {
        try {
            if (mail.subject.includes('UA')/*  && mail.from.value.address == 'notification@transporeon.com' */)
            bot.sendMessage(await getUser(), new TextMessage(`${mail.subject}\n\n${mail.text}`, ...useKeyboard(NO_KEYBOARD)))
        } catch (e) {}
    })

    useMailClient()

    bot.onSubscribe(res => onSubscribe(res))

    bot.onTextMessage(/^START$/, (msg, res) => onSubscribe(res))

    bot.onUnsubscribe(() => setUser({}))
}

module.exports = useBotLogic
const Viber = require('viber-bot')
const { mailEmitter } = require('../events/mail.js')
const { getProfile, authorized, subscribed, setUser } = require('../database/store.js')
const { SECRET_KEY } = require('../config.js')

const TextMessage = Viber.Message.Text

const say = (res, msg) => {
    res.send(new TextMessage(msg))
}

const onSubscribe = async res => {
    try {
        await setUser({
            subscribed: true
        })
    } catch (e) {}
    say(res, "Now you are subscribed!")

    if (!(await authorized())){
        say(res, "Next you need to authorize with TOKEN keyword.")
    } else {
        say(res, 'Enjoy tracking your messages.')
    }
}

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

const useKeyboard = keyboard => [keyboard, null, null, null, 3]

const useBotLogic = async bot => {

    bot.onConversationStarted(async (userProfile, isSubscribed, context, onFinish) => {
        // Set user on start
        try {
            await setUser({
                profile: userProfile,
                subscribed: isSubscribed
            })
        } catch (e) {
            console.log(e)
        }  
        
        if (!isSubscribed){
            const START_MESSAGE = new TextMessage(`Hi, ${userProfile.name}!\nNice to meet you!`, ...useKeyboard(START_KEYBOARD))
            bot.sendMessage(userProfile, START_MESSAGE)
        }
    })

    const useMailClient = () => mailEmitter.on('mail', async mail => {
        try {
            const sub = await subscribed()
            if (sub && mail.subject.includes('UA')/*  && mail.from.value.address == 'notification@transporeon.com' */)
            bot.sendMessage(await getProfile(), new TextMessage(mail.subject))
        } catch (e) {}
    })

    // if user is authorized
    const auth = await authorized()

    if (auth){
        useMailClient()
    }

    bot.onSubscribe(res => onSubscribe(res))

    bot.onTextMessage(/^START$/, (msg, res) => onSubscribe(res))

    bot.onTextMessage(/^TOKEN .*$/, (msg, res) => {
        try {
            if (!auth){
                if (msg.text.replace('TOKEN ', '') == SECRET_KEY){
                    setUser({ authorized: true, subscribed: true })
                    say(res, 'Success!\nEnjoy tracking your messages.')
                    useMailClient()
                } else {
                    setUser({ authorized: false, subscribed: true })
                    say(res, 'Sorry!\nYou cannot use this bot.')
                }
            }
        } catch (e) {}
    })

    bot.onUnsubscribe(userId => {
        try {
            setUser({ subscribed: false, authorized: false, profile: {} })
        } catch (e) {}
    })
}

module.exports = useBotLogic
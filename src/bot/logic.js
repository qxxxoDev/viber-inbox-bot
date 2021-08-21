import Viber from 'viber-bot'
import { mailEmitter } from '../events/mail.js'
import { getUser, setUser } from '../store.js'
import { SECRET_KEY } from '../config.js'

const TextMessage = Viber.Message.Text

const say = (res, msg) => {
    res.send(new TextMessage(msg))
}

const onSubscribe = res => {
    setUser({...getUser(), isSubscribed: true})
    say(res, "Now you are subscribed!")
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

const useBotLogic = bot => {

    bot.onConversationStarted((userProfile, isSubscribed, context, onFinish) => {
        setUser({...userProfile, isSubscribed})
        if (!isSubscribed){
            const START_MESSAGE = new TextMessage(`Hi, ${userProfile.name}!\nNice to meet you!`, ...useKeyboard(START_KEYBOARD))
            bot.sendMessage(userProfile, START_MESSAGE)
        }
    })

    const useMailClient = () => mailEmitter.on('mail', mail => {
        if (getUser().isSubscribed && mail.subject.includes('UA'))
        bot.sendMessage(getUser(), new TextMessage(mail.subject))
    })

    getUser().isAuthorized && useMailClient()

    bot.onSubscribe(res => onSubscribe(res))

    bot.onTextMessage(/^START$/, (msg, res) => onSubscribe(res))

    bot.onTextMessage(/^TOKEN .*$/, (msg, res) => {
        if (!getUser().isAuthorized)
        if (msg.text.replace('TOKEN ', '') == SECRET_KEY){
            setUser({...getUser(), isAuthorized: true})
            say(res, 'Success!\nEnjoy tracking your messages.')
            useMailClient()
        } else {
            say(res, 'Sorry!\nYou cannot use this bot.')
        }
    })

    bot.onUnsubscribe(userId => setUser({...getUser(), isSubscribed: false}))
}

export default useBotLogic
import Seq from 'sequelize'
import  { DEBUG, DATABASE_URL } from '../config.js'

const { Sequelize, DataTypes } = Seq

const seq = DEBUG ? new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
}) : new Sequelize(DATABASE_URL)

try {
    await seq.authenticate()
} catch (err) {
    console.log(err)
}

export const User = seq.define('User', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    profile: {
        type: DataTypes.TEXT
    },
    subscribed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    authorized: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

const get = async key => await (await User.findByPk(1))?.getDataValue(key)

export const getProfile = async () => {
    return JSON.parse(await get('profile') || '{"fail":true}')
}

export const authorized = async () => {
    return await get('authorized')
}

export const subscribed = async () => {
    return await get('subscribed')
}

export const setUser = async ({profile, authorized = false, subscribed = false}) => {
    const data = { profile: JSON.stringify(profile), authorized, subscribed }
    const user = await getProfile()
    
    if (user.fail){
        await User.create(data)
    } else {
        await User.update(data, {where: {id: 1}})
    }
}
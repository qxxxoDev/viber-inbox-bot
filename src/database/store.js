const Seq = require('sequelize')
const { DEBUG, DATABASE_URL } = require('../config.js')
const parse = require('pg-connection-string')

const { Sequelize, DataTypes } = Seq

const seq = DEBUG ? new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
}) : new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
        ssl: true
    }
})

seq.authenticate().then(() => console.log('Connected to the database!')).catch(err => console.log(err))

const User = seq.define('User', {
    uid: {
        type: DataTypes.STRING
    },
    profile: {
        type: DataTypes.TEXT
    },
    subscribed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})
const AuthorizedId = seq.define('AuthorizedId', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },  
    userId: {
        type: DataTypes.STRING
    }
})

const getAuthorizedIds = async () => {
    const ids = []
    try {
        const idModels = await AuthorizedId.findAll()
        idModels.forEach(model => {
            const id = model.getDataValue('userId')
            ids.push(id)
        })
    } catch (e) {}
    return ids
}

const get = async (uid, key) => await (await User.findOne({where: {uid}}))?.getDataValue(key)

const getUser = async uid => {
    return JSON.parse(await get(uid, 'profile') || '{"fail":true}')
}

const getAllAuthorizedUsers = async () => {
    const users = []
    try {
        const authorizedIds = await getAuthorizedIds()
        const userModels = await User.findAll()
        userModels.forEach(model => {
            const profile = JSON.parse(model.getDataValue('profile'))
            if (authorizedIds.includes(profile.id)){
                users.push(profile)
            }
        })
    } catch (e) {}
    return users
}

const subscribe = async (uid, status) => {
    try {
        await User.update({
            subscribed: status
        }, { where: { uid } })
    } catch (e) {}
}

const checkSub = async uid => {
    try {
        const model = await User.findOne({ where: { uid } })
        return !!model.getDataValue('subscribed')
    } catch (e) {}
}

const setUser = async profile => {
    const data = { uid: profile.id, profile: JSON.stringify(profile) }
    const user = await getUser(profile.id)
    
    if (user.fail){
        await User.create(data)
    } else {
        await User.update(data, {where: {uid: profile.id}})
    }
}

module.exports = { User, AuthorizedId, getAllAuthorizedUsers, checkSub, setUser, subscribe, getAuthorizedIds }
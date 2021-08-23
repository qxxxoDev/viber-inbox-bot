const Seq = require('sequelize')
const { DEBUG, DATABASE_URL } = require('../config.js')

const { Sequelize, DataTypes } = Seq

const seq = DEBUG ? new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
}) : new Sequelize(DATABASE_URL)

seq.authenticate().then(() => console.log('Connected to the database!')).catch(err => console.log(err))

const User = seq.define('User', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    profile: {
        type: DataTypes.TEXT
    }
})

const get = async key => await (await User.findByPk(1))?.getDataValue(key)

const getUser = async () => {
    return JSON.parse(await get('profile') || '{"fail":true}')
}

const setUser = async profile => {
    const data = { profile: JSON.stringify(profile) }
    const user = await getUser()
    
    if (user.fail){
        await User.create(data)
    } else {
        await User.update(data, {where: {id: 1}})
    }
}

module.exports = { User, getUser, setUser }
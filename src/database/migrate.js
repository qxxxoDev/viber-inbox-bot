const { User, AuthorizedId } = require('./store.js')

User.sync({ force: true }).then(() => console.log('Migrated Users table!')).catch(err => {
    console.log('Migration failed!')
    console.log(err)
})

AuthorizedId.sync({ force: true }).then(() => console.log('Migrated AuthorizedIds table!')).catch(err => {
    console.log('Migration failed!')
    console.log(err)
})
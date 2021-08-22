import { User } from './store.js'


User.sync({ alter: true }).then(() => console.log('Migrated!')).catch(err => {
    console.log('Migration failed!')
    console.log(err)
})
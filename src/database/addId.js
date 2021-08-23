const userId = process.argv[2]

if (!userId){
    process.exit(1)
}

const { AuthorizedId } = require('./store.js')

AuthorizedId.create({ userId }).then(() => console.log(`${userId} has been authorized.`)).catch(err => {
    console.log('Failed to authorize this id.')
    console.log(err)
})
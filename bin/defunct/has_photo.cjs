const path = require('node:path')
const fs = require('node:fs')

const users = require('../data/users.json')

users.forEach(user => {
  const filepath = path.resolve(
    __dirname,
    `../static/images/protected/students/${user.slug}.jpg`
  )
  if (fs.existsSync(filepath)) {
    user.has_photo = true
  }
})

console.log(JSON.stringify(users, null, 2))

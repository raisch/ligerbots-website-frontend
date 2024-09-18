#!/usr/bin/env node

var fs = require('node:fs')
var path = require('node:path')

var users = require('../data/users-orig.json')

const has_photo = user => {}

const initialCaps = str => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

let count = 0

users.forEach(function (user) {
  count += 1
  Object.keys(user).forEach(function (key) {
    let value = user[key] || ''
    if (typeof value === 'string') {
      user[key] = value
        .replace(/\s+/g, ' ')
        .replace(/^\s+/g, '')
        .replace(/\s+$/g, '')
    }
  })

  user.firstname = initialCaps(user.firstname)
  user.lastname = initialCaps(user.lastname)
  user.email_address = user.email_address.toLowerCase()
  user.parents_email_address = (user.parent_email_address || '').toLowerCase()
  delete user.parent_email_address

  user.password = user.email_address

  user.groups = user.groups.split(/\W+/).map(function (group) {
    return initialCaps(group)
  })

  user.parent_names = user.parents || ''
  delete user.parents

  user.address = user.address
    .split(/\s+/)
    .map(function (part) {
      return initialCaps(part)
    })
    .join(' ')

  user.has_photo = fs.existsSync(
    path.resolve(
      __dirname,
      `../static/images/protected/students/${user.slug}.jpg`
    )
  )
})

console.log(JSON.stringify(users, null, 2))

console.error('Processed ' + count + ' users')

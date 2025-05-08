#!/usr/bin/env node

import 'dotenv/config'

import User from '../src/lib/server/user.js'

function usage() {
  console.log('Usage: bin/loginUser.js <email> <password>')
  process.exit(1)
}

const userEmailAddress = process.argv[2] || 'sbstnalef100@outlook.com'
const userPassword = process.argv[3] || userEmailAddress
// const updateLastLogin = !!process.argv[4]

if (!userEmailAddress || !userPassword) {
  usage()
}

const resp = await User.login(userEmailAddress, userPassword)

console.log(resp, resp ? 'Login successful' : 'Login failed')

// if (resp && updateLastLogin) {
//   const currentDateTime = new Date().toLocaleString()
//   console.log('Updating last login time to:', currentDateTime)
//   await updateUser(userEmailAddress, { last_login: currentDateTime })
// }

process.exit(0)

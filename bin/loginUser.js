#!/usr/bin/env node

import 'dotenv/config'

import { authUser, updateUser } from '../lib/user.js'

function usage () {
  console.log(
    'Usage: bin/loginUser.js <email> <password> [update_last_login:any]'
  )
  process.exit(1)
}

const userEmailAddress = process.argv[2] || 'sbstnalef100@outlook.com'
const userPassword = process.argv[3] || userEmailAddress
const updateLastLogin = !!process.argv[4]

if (!userEmailAddress || !userPassword) {
  usage()
}

const resp = await authUser(userEmailAddress, userPassword)

console.log(resp ? 'Login successful' : 'Login failed')

if (resp && updateLastLogin) {
  const currentDateTime = new Date().toLocaleString()
  console.log('Updating last login time to:', currentDateTime)
  await updateUser(userEmailAddress, { last_login: currentDateTime })
}

process.exit(0)

#!/usr/bin/env node

import 'dotenv/config'
import { getBackendClient } from '../src/lib/server/client.js'

import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

import { updateUser } from '../src/lib/server/user.js'

const filename = process.argv[1] || ''

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const filePath = path.resolve(__dirname, '../data/users.json')

// const users = JSON.parse(readFileSync(filePath, 'utf-8'))

/*
If user exists in the backend, update their information.
If user does not exist, create a new record in the backend.
Keep track of the number of users updated and errors encountered.
After processing all users, log the total number of users updated and errors encountered.
Remove any users that are not in the local data file from the backend.
*/

/*
  read all users from backend
*/
const users = await getBackendClient().request({
  method: 'GET',
  url: '/users'
})

let userCount = 0
let errorCount = 0

for (const user of users) {
  console.log('Updating user:', user.email_address)
  let result
  try {
    result = await updateUser(user.email_address, user)
    userCount++
    console.log({ result })
  } catch (error) {
    errorCount++
    console.error('Error updating user:', user.email_address)
    console.error(error)
  }
  console.log('Result:', result)
}

console.log('Updated', userCount, 'users with', errorCount, 'errors')

process.exit(0)

// Note: This script assumes that the `updateUser` function is defined in the `../lib/user.js` file
// and that it takes an email address and user data as arguments.

// Usage: node bin/syncUsers2Backend.js USERS_FILE.json

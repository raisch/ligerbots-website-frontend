#!/usr/bin/env node

import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

import { updateUser } from '../lib/user.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const filePath = path.resolve(__dirname, '../data/users.json')

const users = JSON.parse(readFileSync(filePath, 'utf-8'))

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

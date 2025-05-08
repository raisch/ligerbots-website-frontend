#!/usr/bin/env node

import 'dotenv/config'

import User from '../src/lib/server/user.js'

async function loadUsers() {
  let users
  try {
    users = await User.listAll()
  } catch (error) {
    console.error('Error loading users:', error.message)
    process.exit(1)
  }
  if (!Array.isArray(users)) {
    console.error('Unexpected data format: users should be an array')
    process.exit(1)
  }
  console.log(`Loaded ${users.length} users from the backend.`)
  return users
}

async function main() {
  const users = await loadUsers()

  // Here you can process the users as needed
  // For example, you could save them to a file or perform further operations
  console.log(users)
}

main().catch((error) => {
  console.error('An error occurred:', error)
  process.exit(1)
})

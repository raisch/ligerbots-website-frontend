#!/usr/bin/env node

import 'dotenv/config'

import { readUser } from '../lib/user.js'

function usage () {
  console.log('Usage: showUser <email>')
  process.exit(1)
}

const userEmailAddress = process.argv[2]
if (!userEmailAddress) {
  usage()
}

const user = await readUser(userEmailAddress)

console.log({ user })

process.exit(0)

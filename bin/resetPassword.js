import { resetPassword } from '../lib/backend'

function usage () {
  console.log('Usage: bin/resetPassword.js <email> <password>')
  process.exit(1)
}

const emailAddress = process.argv[2]
const password = process.argv[3]

if (!emailAddress || !password) {
  usage()
}

const resp = await resetPassword(emailAddress, password)
console.log({ resp })

process.exit(0)

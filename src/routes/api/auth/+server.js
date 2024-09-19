import getDirectusInstance from '$lib/server/directus'
import { generateHash } from '@directus/sdk'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const url = require('node:url')

import { json } from '@sveltejs/kit'

/*
This is the start of an auth api route that will be used to authenticate users against their 
password hash as stored in directus user collection.

given a password, the hash is generated and compared to the stored hash in directus.

*/

export async function GET (event) {
  const directus = await getDirectusInstance()
  const value = new URL(event.url.toString()).searchParams.get('value')

  // "$argon2id$v=19$m=65536,t=3,p=4$AOtv5o+83kh+2IvH+/WvcA$FC5OfDMyoKkCoUaSp8lFjLO9JNRaA48a1RNWMQOSyYc"
  // "$argon2id$v=19$m=65536,t=3,p=4$X839eHLNr0Z7KastTRxiMQ$Ah4bwkmyuQVdgBWXh3KarLD01GK6YGqw8T3tHcZYwPs"

  const result = value
    ? await directus.request(generateHash(value))
    : 'NO VALUE'

  console.log(JSON.stringify(event, null, 2))
  console.log(JSON.stringify(new URL(event.url.toString()), null, 2))
  console.log('GET /api/auth/+server.js', value, result)

  return json({
    message: 'GET /api/auth/+server.js',
    value,
    result
  })
}

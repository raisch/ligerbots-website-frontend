/**
 * @module routes/api/signup
 */

import createDebugMessages from 'debug'

import { json } from '@sveltejs/kit'

import User from '$lib/server/user'

const debug = createDebugMessages('APP:src/routes/api/login/+server')

/**
 *
 * @param {Object} options
 * @param {Request} options.request
 *
 * @returns {Promise<Response>}
 */
export async function POST({ request }) {
  const json = await request.json()

  const existingUser = await User.findByEmail(json.email)
  if (existingUser) return json({ error: 'Email already in use' }, { status: 400 })
  
  // if (password1 !== password2) return json({ error: 'Passwords do not match' }, { status: 400 })
  // if (password1.length < 1) return json({ error: 'Password is required' }, { status: 400 })
  
  let accountRequest = await User.requestAccount(json)

  return json({  })
}

/**
 * This is the service:port/api/auth route that will be used to authenticate users against their
 * password hash as stored in directus user collection.
 *
 * This route will be called from the client side to authenticate the user as
 *     POST /api/login
 * with the following payload:
 *    { email: string, password: string }
 *
 * @module
 */

import Debug from 'debug'

import { json } from '@sveltejs/kit'

import User from '$lib/server/user'

const $debug = Debug('APP:src/routes/api/login/+server')

/**
 *
 * @param {Object} options
 * @param {Request} options.request
 *
 * @returns {Promise<Response>}
 */
export async function POST({ request }) {
  const debug = $debug.extend('POST')

  const { email, password } = await request.json()

  // const userObj = await User.findByEmail(email)

  const user = await User.login(email, password)
  if (!user) {
    return json({ error: 'Invalid email or password' })
  }

  debug('POST /api/auth/+server user', user)
  return json({ user })
}

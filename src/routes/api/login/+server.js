/** @module
 * This is the service:port/api/auth route that will be used to authenticate users against their
 * password hash as stored in directus user collection.
 *
 * This route will be called from the client side to authenticate the user as
 *     POST /api/login
 * with the following payload:
 *    { email: string, password: string }
 *
 */

import { json } from '@sveltejs/kit'

import User from '$lib/server/user'

export async function POST ({ request }) {
  const { email, password } = await request.json()

  // const userObj = await User.findByEmail(email)

  const user = await User.login(email, password)
  if (!user) {
    return json({ error: 'Invalid email or password' })
  }

  console.log('POST /api/auth/+server user', user)
  return json({ user })
}

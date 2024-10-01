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

  const userObj = await User.build({ email, password })

  const result = await userObj.auth(true)
  if (result.error) {
    return json({ error: result.error })
  } else if (result.user) {
    const user = result.user
    console.log('POST /api/auth/+server user', user)
    if (user.status !== 'published') {
      // fail login if user is not published
    } else {
      // do something with the user object
    }
  }
  return json({ result })
}

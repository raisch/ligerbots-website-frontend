/**
 * This is the service:port/api/auth route that will be used to authenticate users against their
 * password hash as stored in directus user collection.
 *
 * This route will be called from the client side to authenticate the user as
 *     POST /api/login
 * with the following payload:
 *    { email: string, password: string }
 *
 * @module routes/api/login
 */

import createDebugMessages from 'debug'

import { json } from '@sveltejs/kit'

import User from '$lib/server/user'

const debug = createDebugMessages('APP:src/routes/api/login/+server')

/**
 *
 * @returns {Promise<Response>}
 */
export async function POST({ request, cookies }) {
  const { email, password } = await request.json()
  console.log('login', email)
  const user = await User.login(email, password)
  if (!user) {
    return json({ error: 'Invalid email or password' })
  }

  const jwt = User.signJWT(user);

  cookies.set('jwt', jwt, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'strict',
  });
  debug('POST /api/auth/+server user', user)
  return json({
    id: user.id,
    user,
    jwt,
  });
}

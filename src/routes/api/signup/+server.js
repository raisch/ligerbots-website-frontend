/**
 * @module routes/api/signup
 */

import createDebugMessages from 'debug'

import { json } from '@sveltejs/kit'

import User from '$lib/server/user'
import jsonwebtoken from 'jsonwebtoken'

const debug = createDebugMessages('APP:src/routes/api/login/+server')

/**
 *
 * @returns {Promise<Response>}
 */
export async function POST({ request, cookies }) {
  /** @type {import('$lib/server/user').UserRegistration} */
  const body = await request.json();

  const existingUser = await User.findByEmail(body.email_address);
  if (existingUser) return json({ error: 'Email already in use' }, { status: 400 });
  
  // if (password1 !== password2) return json({ error: 'Passwords do not match' }, { status: 400 })
  // if (password1.length < 1) return json({ error: 'Password is required' }, { status: 400 })
  
  const user = User.register(body);

  const jwt = User.signJWT(body);
  if (!jwt) return json({ error: 'Failed to create user' }, { status: 500 });

  cookies.set('jwt', jwt, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'strict',
  });
  return json({
    id: body.id,
    user,
    jwt,
  });
}

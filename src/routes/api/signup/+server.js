/**
 * @module routes/api/signup
 */

import createDebugMessages from 'debug'

import { json } from '@sveltejs/kit'

import User from '$lib/server/user'
import { REGISTRATION_KEY } from '$env/static/private'

const debug = createDebugMessages('APP:src/routes/api/login/+server')

/**
 *
 * @returns {Promise<Response>}
 */
export async function POST({ request, cookies }) {
  console.log('signup request received')

  /** @type {{registration: import('$lib/server/user').UserRegistration; key: string;}} */
  const {registration, key} = await request.json();
  
  if (key != REGISTRATION_KEY) return json({ error: 'Invalid registration key' }, { status: 403 });
  
  const jwt = User.signJWT(registration);

  const existingUser = await User.findByEmail(registration.email_address);

  console.log(registration, key, existingUser)

  // In case the user forgot the password
  if (existingUser) {
    await User.resetPassword(existingUser.id, registration.password);
    
    return json({
      id: existingUser.id,
      user: existingUser,
      jwt
    });
  }
  
  // if (password1 !== password2) return json({ error: 'Passwords do not match' }, { status: 400 })
  // if (password1.length < 1) return json({ error: 'Password is required' }, { status: 400 })
  
  const user = User.register(registration);

  if (!jwt) return json({ error: 'Failed to create user' }, { status: 500 });

  cookies.set('jwt', jwt, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: false,
    secure: true,
    path: '/',
    sameSite: 'strict',
  });
  return json({
    id: registration.id,
    user,
    jwt
  });
}

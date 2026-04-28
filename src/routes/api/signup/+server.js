/**
 * @module routes/api/signup
 */

import createDebugMessages from 'debug'

import { json } from '@sveltejs/kit'

import User from '$lib/server/user'
import { REGISTRATION_KEY, ID_HASH_PEPPER } from '$env/static/private'

import crypto from 'node:crypto'

const debug = createDebugMessages('APP:src/routes/api/login/+server')

/**
 *
 * @returns {Promise<Response>}
 */
export async function POST({ request }) {
  console.log('signup request received')

  /** @type {{registration: import('$lib/server/user').UserRegistration; key: string;}} */
  const {registration, key} = await request.json();
  
  if (key != REGISTRATION_KEY) return json({ error: 'Invalid registration key' }, { status: 403 });
  
  const user = await User.register(registration);

  // Hash of user id
  const token = crypto.hash('sha256', user.id + ID_HASH_PEPPER, 'base64url');
  
  await User.setToken(user.id, token);

  console.log('signup successful for user', user.id)

  return json({ token });
}

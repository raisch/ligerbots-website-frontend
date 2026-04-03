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
 * @param {Object} options
 * @param {Request} options.request
 *
 * @returns {Promise<Response>}
 */
export async function POST({ request }) {
  /** @type {import('$lib/server/user').UserRegistration} */
  const body = await request.json();

  const existingUser = await User.findByEmail(body.email_address);
  if (existingUser) return json({ error: 'Email already in use' }, { status: 400 });
  
  // if (password1 !== password2) return json({ error: 'Passwords do not match' }, { status: 400 })
  // if (password1.length < 1) return json({ error: 'Password is required' }, { status: 400 })
  
  User.register(body);

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return json({ error: 'Server configuration error: JWT secret is not set' }, { status: 500 });
  }
  const jwt = jsonwebtoken.sign({
    id: body.id,
    email_address: body.email_address,
    is_admin: body.is_admin,
    carpool_driver_eligible: body.carpool_driver_eligible,
  }, secret, { expiresIn: '7d' });

  return json({ 
    id: body.id,
    jwt,
  });
}

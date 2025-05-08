/** @module routes/directory */

import User from '$lib/server/user'

/** Loader for directory
 * @returns {Promise<object>} - Returns a promise that resolves to an object containing an array of users.
 */
export async function load() {
  let users

  try {
    users = await User.listForDirectory()
  } catch (error) {
    console.error(error) // TODO handle error
  }

  // sort by lastname (case-insensitive) ascending.
  if (users) {
    users = users.sort((a, b) => (a.lastname.toUpperCase() < b.lastname.toUpperCase() ? -1 : 1))
  }

  return { users }
}

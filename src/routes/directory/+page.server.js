/** @module routes/directory */

import User from '$lib/server/user'

/** Loader for directory
 * @returns {Promise<object>} - Returns a promise that resolves to an object containing an array of users.
 */
export async function load(page) {
  User.requireLogin(page)

  let users
  let user

  try {
    users = await User.listForDirectory()
  } catch (error) {
    console.error(error) // TODO handle error
  }

  try {
    user = await document.cookie.split('; ').find(row => row.startsWith('user='))?.split('=', 2)[1] || sessionStorage.getItem('user')
  } catch (error) {
    console.error(error)
  }

  // sort by lastname (case-insensitive) ascending.
  if (users) {
    users = users.sort((a, b) => (a.lastname.toUpperCase() < b.lastname.toUpperCase() ? -1 : 1))
  }

  return { users }
}

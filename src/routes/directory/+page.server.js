import User from '$lib/server/user'

/** @type {import('./$types').PageServerLoad} */
export async function load () {
  let users
  try {
    users = await User.listForDirectory()
  } catch (error) {
    console.error(error)
  }

  // sort by lastname (case-insensitive) ascending.
  if (users) {
    users = users.sort((a, b) =>
      a.lastname.toUpperCase() < b.lastname.toUpperCase() ? -1 : 1
    )
  }

  return { users }
}

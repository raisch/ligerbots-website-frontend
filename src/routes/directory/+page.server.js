// @ts-nocheck

import getDirectusInstance from '$lib/server/directus'
import getSiteConfig from '$lib/server/site'
import getUsers from '$lib/server/users'

/** @type {import('./$types').PageLoad} */
export async function load (opts) {
  const client = await getDirectusInstance()

  let site = {}
  try {
    site = await getSiteConfig()
  } catch (error) {
    console.error(`failed to retrieve site config: ${error}`)
  }

  let users
  try {
    users = await getUsers()
  } catch (error) {
    console.error(error)
  }

  // sort by lastname (case-insensitive) ascending.
  users = users.sort((a, b) =>
    a.lastname.toUpperCase() < b.lastname.toUpperCase() ? -1 : 1
  )

  return { site, users }
}

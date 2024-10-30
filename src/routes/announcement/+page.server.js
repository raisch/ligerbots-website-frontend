import getPostsByType from '$lib/server/post.js'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  /** @type {Array<object>} */
  let posts
  try {
    posts = await getPostsByType('announcement')
  } catch (error) {
    console.error(error)
  }

  // sort by publish_on descending.
  if (posts) {
    posts = posts.sort((a, b) => (a.publish_on < b.publish_on ? -1 : 1))
  }

  return { posts }
}

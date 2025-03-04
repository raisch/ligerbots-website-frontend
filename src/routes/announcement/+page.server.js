/** @module */

/** @import {PostRecordList} from '$lib/server/post.js' */
import { getPostsByType } from '$lib/server/post.js'

/** @type {import('@sveltejs/kit').Load} */
export async function load() {
  /** @type {PostRecordList|null} */
  let posts = null
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

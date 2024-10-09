import createDebugMessages from 'debug'

import { error } from '@sveltejs/kit'

import getPost from '$lib/server/post'

const debug = createDebugMessages('APP:routes/post/[slug]/+post.server')

/**
 * Format date string to human-readable format.
 *
 * @param {String} str
 * @returns {String}
 */
function prettyDate (str) {
  const date = new Date(str)
  return date.toLocaleDateString('en-US', {
    // weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/** @type {import('./$types').PageServerLoad} */
export async function load ({ params }) {
  const slug = params.slug || 'unknown_post'

  /** @type {import('$lib/server/post').PostRecord} */
  let post
  try {
    post = await getPost(slug)
  } catch (err) {
    console.error(`Error fetching post: ${err}`)
    throw error(404, 'Page not found')
  }

  debug(`in load, post: ${JSON.stringify(post)}`)

  // Replace sandbox attribute in iframes
  post.body = post?.body.replace(
    /(<iframe.*?)sandbox(?:="")?>/g,
    '$1 sandbox="allow-same-origin allow-scripts allow-popups allow-forms">'
  )

  post.publish_on = prettyDate(post.publish_on)

  return { post }
}

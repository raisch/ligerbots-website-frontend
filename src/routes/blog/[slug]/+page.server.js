import createDebugMessages from 'debug'

import { error } from '@sveltejs/kit'

import getPostBySlug from '$lib/server/post'
import { prettyDate } from '$lib/util'

const debug = createDebugMessages('APP:routes/announcement/[slug]/+post.server')

/** @type {import('@sveltejs/kit').Load} */
export async function load({ params }) {
  const slug = params.slug || 'unknown_post'

  /** @type {import('$lib/server/post').PostRecord} */
  let post
  try {
    post = await getPostBySlug(slug)
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

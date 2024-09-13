/** @type {import('./$types').PageLoad} */

import getFileUrlBySlug from '$lib/file'

export async function load ({ params }) {
  const slug = params.slug
  // console.log('slug', slug)
  return await getFileUrlBySlug(slug)
}

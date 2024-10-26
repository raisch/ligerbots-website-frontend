/** @type {import('./$types').PageServerLoad} */
import getSiteConfig from '$lib/server/site'
// import getNavbarConfig from '$lib/server/navbar'
import Post from '$lib/server/post'

export async function load ({ fetch }) {
  const site = await getSiteConfig()
  // console.log(
  //   `\nin +page.server.js/getSiteConfig, config: ${JSON.stringify(site)}\n`
  // )

  // Fetch the posts
  let posts
  try {
    let result = await Post.getAllPosts()
    posts = { posts: result.post, error: '' }
  } catch (err) {
    posts = { error: `Error Fetching Posts` }
    console.error(`Error fetching post: ${err}`)
  }

  return { site, posts }
}

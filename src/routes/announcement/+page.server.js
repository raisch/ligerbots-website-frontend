import getPosts from '$lib/server/posts'
import { error } from '@sveltejs/kit'

export async function load({ params }) {
    /** @type {import('$lib/server/post').PostRecord} */
    let posts
    try {
        posts = await getPosts()
    } catch (err) {
        console.error(`Error fetching post: ${err}`)
        throw error(404, 'Page not found')
    }
    
    return { posts }
}      
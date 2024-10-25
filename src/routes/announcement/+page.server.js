import Post from '$lib/server/post'
import { error } from '@sveltejs/kit'

export async function load({ params }) {
    let posts
    try {
        posts = await Post.getAllPosts()
    } catch (err) {
        console.error(`Error fetching post: ${err}`)
        throw error(404, 'Page not found')
    }
    
    return { posts }
}      
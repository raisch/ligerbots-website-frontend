import Announcement from '$lib/server/announcement'
import { error } from '@sveltejs/kit'

export async function load({ params }) {
    let posts
    try {
        posts = await Announcement.listPublishedAnnouncements()
    } catch (err) {
        console.error(`Error fetching post: ${err}`)
        throw error(404, 'Page not found')
    }
    
    return { posts }
}      
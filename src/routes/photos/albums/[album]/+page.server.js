import { getPhotosFromAlbum } from '$lib/server/photos.js'

export async function load({ params }) {
    const { album } = params
    return {
        photos: await getPhotosFromAlbum(album)
    }
}
import { getPhotoAlbumsForYear } from '$lib/server/photos'

export async function load({ params }) {
    const { year } = params
    return {
        title: `Photos from ${year} season`,
        albums: (await getPhotoAlbumsForYear(year)).map(album => ({
            title: album,
            url: `/photos/album/${album}`,
            imageUrl: ``,
        }))
    }
}
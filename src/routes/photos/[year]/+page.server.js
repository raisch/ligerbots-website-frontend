import { getPhotoAlbumsForYear, getPhotoUrl } from '$lib/server/photos'

export async function load({ params }) {
    const { year } = params
    return {
        title: `Photos from ${year} season`,
        photos_link: "https://www.flickr.com/photos/ligerbots/",
        videos_link: "https://www.youtube.com/c/ligerbots",
        albums: (await getPhotoAlbumsForYear(year)).map(album => ({
            title: album,
            url: `/photos/album/${album}`,
            imageUrl: getPhotoUrl(album.primary),
        }))
    }
}
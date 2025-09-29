/** @module */

import { FLICKR_USER_ID, FLICKR_API_KEY } from '$env/static/private'

import { createFlickr } from 'flickr-sdk'

const { flickr } = createFlickr(FLICKR_API_KEY)

/**
 * @param {string|number} year
 */
export async function getPhotoAlbumsForYear(year) {
  const photosets = await getAllPhotoAlbums()
    return photosets.filter(photoset => new Date(Number(photoset.date_create) * 1000).getFullYear() === Number(year))
}

/**
 * 
 * @returns {Promise<{id: string; primary: string; title: string; date_create: string; date_update: string;}[]>}
 */
export async function getAllPhotoAlbums() {
  const body = await flickr('flickr.photosets.getList', {
    user_id: FLICKR_USER_ID
  })

  return body.photosets.photoset
}

/**
 * @param {number} page 
 */
export async function getRecentPhotos(page) {}
/**
 * @param {number} year
 */
export async function getPhotosFromYear(year) {}

/**
 * @param {string} id
 */
export async function getPhotosFromAlbum(id) {
  const body = await flickr('flickr.photosets.getPhotos', {
    user_id: FLICKR_USER_ID,
    photoset_id: id
  })

  return body.photoset.photo
}

/**
 * @param {string} photo
 */
export async function getPhotoUrl(photo) {
    const body = await flickr('flickr.photos.getSizes', {
        photo_id: photo
    })
    return body.sizes.size.find((/** @type {{ label: string; }} */ s) => s.label === 'Original').source
}
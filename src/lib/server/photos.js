/** @module */

import { FLICKR_USER_ID, FLICKR_API_KEY } from '$env/static/private'

import { createFlickr } from 'flickr-sdk'

const { flickr } = createFlickr(FLICKR_API_KEY)

/**
 * @param {string} name
 */
export async function getPhotoAlbumsForYear(name) {
    return [""];
}

export async function getPhotosets() {
  const body = await flickr('flickr.photosets.getList', {
    user_id: FLICKR_USER_ID
  })

  return body.photosets.photoset
}
/**
 * @param {string} id
 */
export async function getPhotos(id) {
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
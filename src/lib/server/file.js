// import getDirectusInstance from '$lib/server/directus'
import { getBackendClient } from '$lib/../../lib/backend'
import { readFiles, readFile } from '@directus/sdk'

const API_URL = 'http://ligerbots.4msg.net:8055'

// TODO - change this to just return the URL and add a separate function to download the file

const uppercaseWords = (/** @type {string} */ str) => {
  return str.replace(/\b\w/g, (/** @type {string} */ name) =>
    name.toUpperCase()
  )
}

const slugToProperName = (/** @type {string} */ slug) => {
  return uppercaseWords(slug.replace(/-/g, ' '))
}

// @ts-ignore
async function getFileUrlBySlug (slug, ext = 'jpg') {
  const directus = await getBackendClient() // getDirectusInstance()
  const filename = `${slug}.${ext}`
  const query = {
    filter: {
      filename_download: { _eq: filename }
    },
    fields: ['id']
  }

  let resp

  try {
    resp = await directus.request(readFiles(query))
  } catch (err) {
    console.error(err)
    return null
  }

  const fileId = resp[0]?.id
  const url = fileId ? `${API_URL}/assets/${fileId}` : null
  const properName = slugToProperName(slug)

  return { slug, fileId, filename, properName, url }
}

export default getFileUrlBySlug

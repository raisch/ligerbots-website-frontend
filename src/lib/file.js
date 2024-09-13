import getDirectusInstance from '$lib/directus'
import { readFiles, readFile } from '@directus/sdk'

const API_URL = 'http://ligerbots.4msg.net:8055'

// TODO - change this to just return the URL and add a separate function to download the file

// @ts-ignore
async function getFileUrlBySlug (slug, ext = 'jpg') {
  const directus = await getDirectusInstance()

  const filename = `${slug}.${ext}`

  const query = {
    filter: {
      filename_download: { _eq: filename }
    },
    fields: ['id']
  }

  const resp = await directus.request(readFiles(query))

  const fileId = resp[0]?.id
  const url = fileId ? `${API_URL}/assets/${fileId}/image.jpg` : null
  const properName = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())

  return { slug, fileId, filename, properName, url }
}

export default getFileUrlBySlug

import getDirectusInstance from '$lib/directus'
import { readFiles, readFile } from '@directus/sdk'

const API_URL = 'http://ligerbots.4msg.net:8055'

// @ts-ignore
async function getFileUrlBySlug (slug, ext = 'jpg') {
  const directus = await getDirectusInstance()

  const filename = `${slug}.${ext}`

  const query = {
    filter: {
      filename_download: { _eq: filename   }
    },
    fields: ['id']
  }

  const resp = await directus.request(readFiles(query))

  const fileId = resp[0]?.id
  const url = fileId ? `${API_URL}/assets/${fileId}/${filename}` : null

  return { slug, fileId, filename, url }
}

export default getFileUrlBySlug

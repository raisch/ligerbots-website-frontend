#!/usr/bin/env node

import 'dotenv/config'

import { getBackendClient } from '../lib/backend.js'

import { readFolders, readFiles } from '@directus/sdk'

const client = await getBackendClient()

const foldername = process.argv[2]
const filename = process.argv[3]

console.log({ foldername, filename })

const folders = await client.request(
  readFolders({
    fields: 'id,name',
    filter: {
      name: {
        _eq: foldername
      }
    }
  })
)

if (!folders || folders.length !== 1) {
  console.error(`No folder found with name: ${foldername}`)
  process.exit(1)
}

console.log({ folders })

const folderId = folders[0].id

console.log(`Folder ID: ${folderId}`)

const query = {
  // fields: 'id,folder,filename_disk,filename_download',
  filter: {
    _and: [
      {
        folder: {
          _eq: folderId
        }
      },
      {
        filename_download: {
          _eq: filename
        }
      }
    ]
  }
}

console.log(JSON.stringify(query, null, 2))

const files = await client.request(readFiles(query))

if (!files || files.length !== 1) {
  console.error(`No file found with name: ${foldername}/${filename}`)
  process.exit(1)
}

console.log(JSON.stringify(files, null, 2))

process.exit(0)

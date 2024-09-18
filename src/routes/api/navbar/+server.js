import { json } from '@sveltejs/kit'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const data = require('../../../../data/navbar.json')

export async function GET (event) {
  console.log('GET /api/navbar', JSON.stringify(event, null, 2))
  console.log('data', JSON.stringify(data, null, 2))
  return json(data)
}

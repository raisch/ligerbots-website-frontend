import { getBackendClient } from '$lib/server/client'

/**
 * Get full list of posts from Directus
 * 
 * @returns {Promise<PostRecord[]>}
 */
export default async function getPosts() {
    const client = await getBackendClient()

    let getQuery = `{
    post {
        slug
        status
        type
        title
        publish_on
        }
    }`

    let result
    try {
        const resp = await client.query(getQuery)
        result = resp
    } catch (err) {
        throw new Error(`failed to retrieve post: ${JSON.stringify(err)}`)
    }

    return result
}

/**
 * @typedef {Object} PostRecord
 *
 * @property {string} slug
 * @property {string} type
 * @property {string} status
 * @property {string} publish_on
 * @property {string} title
 */
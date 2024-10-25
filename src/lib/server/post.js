import createDebugMessages from 'debug'

import { getBackendClient } from '$lib/server/client'

const debug = createDebugMessages('APP:$lib/server/post')

export default class Post {
    /**
     * List all posts in Directus
     * 
     * @returns {Promise.<Array<PostRecord>>}
     */
    static async getAllPosts() {
        const client = await getBackendClient()

        const query = `
        {
            post {
                slug
                status
                type
                title
                body
                publish_on
                auto_publish
                thumbnail {
                    id
                    filename_disk
                    filename_download
                }
            }
        }
        `

        debug(`Post.getAllPosts(query: ${query})`)
    }
}

/**
 * @typedef {Object} PostRecord
 *
 * @property {string} slug
 * @property {string} type
 * @property {string} status
 * @property {string} publish_on
 * @property {string} title
 * @property {string} body
 * @property {string} [thumbnail]
 */
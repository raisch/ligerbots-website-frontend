import createDebugMessages from 'debug'

import { getBackendClient } from '$lib/server/client'

const debug = createDebugMessages('APP:$lib/server/post')

export default class Post {
    /**
     * List all posts in Directus
     * 
     * @returns {Promise<Array<PostRecord>>}
     */
    static async getAllPosts() {
        const client = await getBackendClient();

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

        debug(`Post.getAllPosts(query: ${query})`);

        let result;

        try {
            const resp = await client.query(query);
            result = resp;
        } catch (err) {
            throw new Error(`Failed to retrieve all posts: ${JSON.stringify(err)}`);
        }

        return result
    }

    /**
     * Get post from Directus
     * 
     * @param {string} slug - The slug of the post.
     * 
     * @returns {Promise<PostRecord>}
     */
    static async getPostBySlug(slug) {
        const client = await getBackendClient();

        const query = `
        {
            post(filter: { slug: { _eq: "${slug}" } }) {
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

        debug(`Post.getPostBySlug(slug: ${slug} query: ${query})`);

        let result;

        try {
            const resp = await client.query(query);
            result = resp.post.shift()
        } catch (err) {
            throw new Error(`Failed to retrieve post: ${JSON.stringify(err)}`);
        }

        return result
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
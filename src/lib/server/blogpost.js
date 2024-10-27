import createDebugMessages from 'debug'
import { getBackendClient } from '$lib/server/client'

const debug = createDebugMessages('APP:$lib/server/blogpost')

export default class BlogPost {
    /**
     * List all blog posts in Directus
     * This only retrieves posts that are published.
     * 
     * @returns {Promise<Array<BlogPostRecord>>}
     */
    static async listPublishedBlogPosts() {
        const client = await getBackendClient();

        const query = `
        {
            post(
                filter: {
                    _and: [{ type: { _eq: "blog_post" } }, { status: { _eq: "published" } }]
                }
                sort: "-publish_on"
                limit: 5
            ) {
                slug
                title
                body
                publish_on
            }
        }`

        debug(`BlogPost.listPublishedAnnouncements(query: ${query})`);

        let result;

        try {
            const resp = await client.query(query);
            result = resp;
        } catch (err) {
            throw new Error(`Failed to retrieve posts: ${JSON.stringify(err)}`);
        }

        return result
    }

    /**
     * Get blog post from Directus
     * 
     * @param {string} slug - The slug of the post.
     * 
     * @returns {Promise<BlogPostRecord>}
     */
    static async getBlogPostBySlug(slug) {
        const client = await getBackendClient();

        const query = `
        {
            post(filter: { slug: { _eq: "${slug}" } }) {
                slug
                title
                body
                publish_on
            }
        }`

        debug(`BlogPost.getBlogPostBySlug(query: ${query})`);

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
 * @typedef {Object} BlogPostRecord
 *
 * @property {string} slug
 * @property {string} publish_on
 * @property {string} title
 * @property {string} body
 * @property {string} [thumbnail]
 */
import createDebugMessages from 'debug'
import { getBackendClient } from '$lib/server/client'

const debug = createDebugMessages('APP:$lib/server/announcement')

export default class Announcement {
    /**
     * List all announcements in Directus
     * This only retrieves announcements that are published.
     * 
     * @returns {Promise<Array<AnnouncementRecord>>}
     */
    static async listPublishedAnnouncements() {
        const client = await getBackendClient();

        const query = `
        {
            post(
                filter: {
                    _and: [{ type: { _eq: "announcement" } }, { status: { _eq: "published" } }]
                }
                sort: "-publish_on"
            ) {
                slug
                title
                body
                publish_on
            }
        }`

        debug(`Announcement.listPublishedAnnouncements(query: ${query})`);

        let result;

        try {
            const resp = await client.query(query);
            result = resp;
        } catch (err) {
            throw new Error(`Failed to retrieve announcements: ${JSON.stringify(err)}`);
        }

        return result
    }

    /**
     * Get announcement from Directus
     * 
     * @param {string} slug - The slug of the announcement.
     * 
     * @returns {Promise<AnnouncementRecord>}
     */
    static async getAnnouncementBySlug(slug) {
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

        debug(`Announcement.getAnnouncementBySlug(query: ${query})`);

        let result;

        try {
            const resp = await client.query(query);
            result = resp.post.shift()
        } catch (err) {
            throw new Error(`Failed to retrieve announcement: ${JSON.stringify(err)}`);
        }

        return result
    }
}

/**
 * @typedef {Object} AnnouncementRecord
 *
 * @property {string} slug
 * @property {string} publish_on
 * @property {string} title
 * @property {string} body
 * @property {string} [thumbnail]
 */
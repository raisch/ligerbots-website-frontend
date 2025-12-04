/**
 * GraphQL queries related to the `post` collection in Directus.
 *
 * - `POSTS_QUERY` – Retrieves up to 5 posts that are:
 *   - `status = "published"`
 *   - `type = "announcement"`
 *   sorted by `publish_on` in descending order.
 *
 * This query is consumed by `$lib/server/announcements.js` to power the announcements
 * section on the site.
 *
 * @module graphql/post
 */

export const POSTS_QUERY = `
  query Post {
      post(
        filter: {
          _and: [
            {status: { _eq: "published" } },
            {type: {_eq: "announcement"}}
          ]
        },
        sort: [
          "-publish_on"
        ],
        limit: 5
      ) {
        type
        slug
        title
        publish_on
        lede
        status
      }
  }`

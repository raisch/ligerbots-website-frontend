import createDebugMessages from 'debug';

import { error } from '@sveltejs/kit';

import getPostBySlug from '$lib/server/post';
import { prettyDate } from '$lib/util';

const debug = createDebugMessages('APP:routes/post/[slug]/+post.server');

const PreviousQuery = `{
  post: post(
    filter: { publish_on: { _lt: "{{date}}" } },
    sort: ["-publish_on"],
    limit: 1
  ) {
    id
    slug
    title
    publish_on
  }
}`;

const NextQuery = `{ post: post(
    filter: { publish_on: { _gt: "{{date}}" } },
    sort: ["publish_on"],
    limit: 1
  ) {
    id
    slug
    title
    publish_on
  }
}`;

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const slug = params.slug || 'unknown_post';

  /** @type {import('$lib/server/post').PostRecord} */
  let post;
  try {
    post = await getPostBySlug(slug);
  } catch (err) {
    console.error(`Error fetching post: ${err}`);
    throw error(404, 'Page not found');
  }

  // Get the posts before and after the requested one
  const date = new Date(post.publish_on).toISOString().split('T')[0];

  let nextPost;
  try {
    nextPost = await getPostBySlug(
      slug,
      NextQuery.replaceAll('{{date}}', date)
    );
  } catch (err) {
    console.error(`Error fetching post: ${err}`);
    throw error(404, 'Page not found');
  }

  let prevPost;
  try {
    prevPost = await getPostBySlug(
      slug,
      PreviousQuery.replaceAll('{{date}}', date)
    );
  } catch (err) {
    console.error(`Error fetching post: ${err}`);
    throw error(404, 'Page not found');
  }

  debug(`in load, post: ${JSON.stringify(post)}`);

  // Replace sandbox attribute in iframes
  post.body = post?.body.replace(
    /(<iframe.*?)sandbox(?:="")?>/g,
    '$1 sandbox="allow-same-origin allow-scripts allow-popups allow-forms">'
  );

  post.publish_on = prettyDate(post.publish_on);

  return { post, nextPost, prevPost };
}

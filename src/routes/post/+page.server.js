import createDebugMessages from 'debug';

import { error } from '@sveltejs/kit';

import getPostBySlug from '$lib/server/post';
import { prettyDate } from '$lib/util';

const debug = createDebugMessages('APP:routes/post/[slug]/+post.server');

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  return {};
}

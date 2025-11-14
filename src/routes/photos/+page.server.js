/** @module routes/photos */

import getSiteConfig from '$lib/server/site';

export async function load({ fetch, url }) {
  let year;

  year = url.searchParams.get('year');

  let data;
  try {
    data = await getSiteConfig();
  } catch (error) {
    console.error('failed to retrieve site config:', error);
  }

  return { data, year };
}

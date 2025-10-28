import getSiteConfig from '$lib/server/site';

export async function load({ fetch }) {
  let data;
  try {
    data = await getSiteConfig();
  } catch (error) {
    console.error('failed to retrieve site config:', error);
  }

  return { data };
}

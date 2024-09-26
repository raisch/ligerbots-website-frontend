// This hook will remove the Content-Type header from the response
/** @type {import('@sveltejs/kit').Handle} */
export async function handle ({ event, resolve }) {
  return await resolve(event, {
    filterSerializedResponseHeaders: (key, value) => {
      return key.toLowerCase() === 'content-type'
    }
  })
}

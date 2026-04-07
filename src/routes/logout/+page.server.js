export async function load({ cookies }) {
  cookies.delete('jwt', { path: '/' })
}
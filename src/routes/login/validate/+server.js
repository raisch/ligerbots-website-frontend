import User from "$lib/server/user";
import { redirect } from "@sveltejs/kit";

export async function GET({ url }) {
  const jwt = url.searchParams.get('token');
  if (!jwt) return new Response('Missing token', { status: 401 });
  const decoded = User.validate(jwt);
  if (!decoded) return new Response('Invalid token', { status: 401 });
  return new Response(`
    <html>
      <head>
        <title>Redirecting...</title>
        <meta http-equiv="refresh" content="0; url=/carpool" />
      </head>
      <body>
        Redirecting...
      </body>
    </html>
  `, {
    headers: {
      'Content-Type': 'text/html',
      'Set-Cookie': `jwt=${jwt}; Max-Age=604800; HttpOnly; Secure; Path=/; SameSite=Strict`
    }
  });

}
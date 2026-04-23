import User from "$lib/server/user";
import { redirect } from "@sveltejs/kit";

export async function POST({ request }) {
  const formData = await request.formData();
  const email = formData.get('email')?.toString() || '';
  const password = formData.get('password')?.toString() || '';
  console.log('login', email);
  
  const user = await User.login(email, password);
  if (!user) return new Response('Invalid email or password', { status: 401 });

  const jwt = User.signJWT(user);

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
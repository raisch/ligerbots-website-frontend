import User from "$lib/server/user";
import { redirect } from "@sveltejs/kit";

export async function POST({ request, cookies }) {
  const formData = await request.formData();
  const email = formData.get('email')?.toString() || '';
  const password = formData.get('password')?.toString() || '';
  console.log('login', email);
  
  const user = await User.login(email, password);
  if (!user) return new Response('Invalid email or password', { status: 401 });

  const jwt = User.signJWT(user);

  cookies.set('jwt', jwt, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: false,
    secure: true,
    path: '/',
    sameSite: 'strict',
  });
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
      'Content-Type': 'text/html'
    }
  });

}
import User from "$lib/server/user.js";
import { redirect } from "@sveltejs/kit";

export async function GET({ params, cookies }) {
  const { id } = params;
  const user = await User.findByToken(id); // change how this works
  if (!user) {
    return new Response("User not found", { status: 404 });
  }
  const jwt = User.signJWT(user);

  cookies.set('jwt', jwt, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: false,
    secure: true,
    path: '/',
    sameSite: 'strict',
  });
  redirect(303, '/carpool');
}
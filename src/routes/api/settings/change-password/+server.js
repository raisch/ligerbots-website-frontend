import User from "$lib/server/user.js";

export async function POST({ request, cookies }) {
  const { email, oldPassword, newPassword } = await request.json();
  try {
    await User.changePassword(email, cookies.get('jwt') ?? '', oldPassword, newPassword);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error changing password:', error);
    //@ts-ignore
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function POST() {
  const logoutUrl = `https://${process.env.COGNITO_DOMAIN}/logout?client_id=${
    process.env.COGNITO_CLIENT_ID
  }&logout_uri=${encodeURIComponent(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth-logout`,
  )}`;

  return Response.json({ redirectUrl: logoutUrl });
}

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete("better-auth.session_token");

  redirect("/");
}

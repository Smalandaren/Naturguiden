import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("NaturguidenCookie");

  if (!sessionCookie) {
    return false;
  }

  try {
    const response = await fetch(`${apiUrl}/auth/check-auth`, {
      cache: "no-cache",
      method: "GET",
      headers: {
        Cookie: `${sessionCookie.name}=${sessionCookie.value}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
}

export async function getSessionCookie(): Promise<RequestCookie | null> {
  try {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get("NaturguidenCookie");

    if (!sessionCookie) {
      return null;
    }

    return sessionCookie;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
}

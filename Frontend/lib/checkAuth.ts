import { AuthCheckResponse } from "@/types/AuthCheckResponse";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function checkAuth(): Promise<AuthCheckResponse> {
  const sessionCookie = await getSessionCookie();
  try {
    const response = await fetch(`${apiUrl}/auth/check-auth`, {
      cache: "no-cache",
      method: "GET",
      headers: {
        Cookie: `${sessionCookie?.name}=${sessionCookie?.value}`,
      },
    });

    if (!response.ok) {
      return {
        authenticated: false,
        user: null,
      };
    }

    const json = (await response.json()) as AuthCheckResponse;

    return {
      authenticated: json.authenticated,
      user: json.user,
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      authenticated: false,
      user: null,
    };
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

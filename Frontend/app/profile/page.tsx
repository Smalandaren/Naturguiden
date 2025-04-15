import { checkAuth, getSessionCookie } from "@/lib/checkAuth";
import { redirect } from "next/navigation";
import ClientPage from "./ClientPage";
import { ProfileBasics } from "@/types/ProfileBasics";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function ProfilePage() {
  let isAuthenticated = false;

  try {
    const authenticated = await checkAuth();

    if (authenticated) {
      isAuthenticated = true;
    }
  } catch (error: any) {
    console.error("Error during authentication check:", error.message);
  }

  if (isAuthenticated) {
    const profile = await getProfile();
    if (profile) {
      return <ClientPage profile={profile} />;
    } else {
      redirect(`/`);
    }
  } else {
    redirect(`/`);
  }
}

async function getProfile(): Promise<ProfileBasics | null> {
  const sessionCookie = await getSessionCookie();

  if (!sessionCookie) {
    return null;
  }

  try {
    const response = await fetch(`${apiUrl}/profile`, {
      cache: "no-cache",
      method: "GET",
      headers: {
        Cookie: `${sessionCookie.name}=${sessionCookie.value}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    return json;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
}

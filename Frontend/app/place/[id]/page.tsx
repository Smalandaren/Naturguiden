import { Place } from "@/types/Place";
import ClientPage from "./ClientPage";
import { getSessionCookie } from "@/lib/checkAuth";
import { ErrorScreen } from "@/components/ErrorScreen";
import { checkAuth } from "@/lib/checkAuth";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authCheck = await checkAuth();

async function getPlace(id: string): Promise<Place | null> {
  try {
    const cookie = await getSessionCookie();
    const response = await fetch(`${apiUrl}/places/${id}`, {
      cache: "no-cache",
      method: "GET",
      headers: {
        Cookie: cookie ? `${cookie.name}=${cookie.value}` : "",
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

export default async function ViewPlace({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const place = await getPlace(id);

    if (place) {
      return <ClientPage place={place} user={authCheck.user} />;
    }

    throw new Error("Could not get place");
  } catch (error: any) {
    console.error("Error fetching courts:", error);
    return (
      <ErrorScreen
        title="Ett fel uppstod"
        subtitle="Platsen kunde inte visas"
      />
    );
  }
}

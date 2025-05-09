import { checkAuth } from "@/lib/checkAuth";
import ClientPage from "./ClientPage";
import { ErrorScreen } from "@/components/ErrorScreen";
import { Place } from "@/types/Place";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function getPlaces(): Promise<Place[] | null> {
  try {
    const response = await fetch(`${apiUrl}/places`, {
      cache: "no-cache",
      method: "GET",
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const places = await getPlaces();
  const auth = await checkAuth();

  if (!places) {
    return (
      <ErrorScreen
        title="Ett fel uppstod"
        subtitle="Platserna kunde inte hämtas"
      />
    );
  }
  return <ClientPage places={places} isAuthenticated={auth.authenticated} />;
}

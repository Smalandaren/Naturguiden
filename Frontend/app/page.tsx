import { ErrorScreen } from "@/components/ErrorScreen";
import ClientPage from "./ClientPage";
import { Place } from "@/types/Place";
import { checkAuth } from "@/lib/checkAuth";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function getPlaces(): Promise<Place[] | null> {
  try {
    const response = await fetch(`${apiUrl}/places`, {
      cache: "no-cache",
      method: "GET",
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    return json;
  } catch (error: any) {
    console.log(error);
    return null;
  }
}

export default async function Home() {
  try {
    const places = await getPlaces();
    const authCheck = await checkAuth();

    if (places) {
      return <ClientPage places={places} user={authCheck.user}/>;
    }

    throw new Error("Could not fetch places");
  } catch (error: any) {
    console.error("Error fetching places:", error);
    return (
      <div className="h-screen">
        <ErrorScreen
          title="Ett fel uppstod"
          subtitle="Platserna kunde inte hämtas"
        />
      </div>
    );
  }
}

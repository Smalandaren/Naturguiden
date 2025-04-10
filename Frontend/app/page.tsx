import ClientPage from "./ClientPage";
import { Place } from "@/types/Place";
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

    if (places) {
      return <ClientPage places={places} />;
    }

    return <p>ERROR!</p>;
  } catch (error: any) {
    console.error("Error fetching places:", error);
    return <p>ERROR! (catch)</p>;
  }
}

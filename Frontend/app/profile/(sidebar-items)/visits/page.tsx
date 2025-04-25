"use client";
import { ProfileBasics } from "@/types/ProfileBasics";
import { useEffect, useState } from "react";
import { ErrorScreen } from "@/components/ErrorScreen";
import { Separator } from "@/components/ui/separator";
import { VisitedPlace } from "@/types/VisitedPlace";
import { VisitedPlaceCard } from "./VisitedPlaceCard";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [visitedPlaces, setVisitedPlaces] = useState<VisitedPlace[]>();

  async function returnVisitedPlaces(): Promise<VisitedPlace[] | null> {
    try {
      const response = await fetch(`${apiUrl}/profile/visited-places`, {
        cache: "no-cache",
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function getVisitedPlaces() {
    setIsLoading(true);
    const places = await returnVisitedPlaces();
    if (places) {
      setVisitedPlaces(places);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getVisitedPlaces();
  }, []);

  if (isLoading) {
    return <p>loading</p>;
  }
  if (visitedPlaces == null) {
    return (
      <ErrorScreen
        title="Platserna kunde inte visas"
        subtitle="Försök igen senare"
      />
    );
  }

  return (
    <div className="mx-6 pt-16">
      <h1 className="text-3xl font-bold mb-4">Mina besök</h1>
      <Separator />
      <div className="mt-4 max-w-2xl">
        {visitedPlaces.map((place) => {
          return <VisitedPlaceCard key={place.id} place={place} />;
        })}
      </div>
    </div>
  );
}

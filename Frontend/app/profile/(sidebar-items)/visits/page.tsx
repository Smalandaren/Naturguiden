"use client";
import { ProfileBasics } from "@/types/ProfileBasics";
import { useEffect, useState } from "react";
import { ErrorScreen } from "@/components/ErrorScreen";
import { Separator } from "@/components/ui/separator";
import { VisitedPlace } from "@/types/VisitedPlace";
import { VisitedPlaceCard } from "./VisitedPlaceCard";
import CenteredLoadingIndicator from "@/components/CenteredLoadingIndicator";
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
    return <CenteredLoadingIndicator />;
  }
  if (visitedPlaces == null) {
    return (
      <ErrorScreen
        title="Platserna kunde inte visas"
        subtitle="Försök igen senare"
      />
    );
  }

  if (visitedPlaces != null && visitedPlaces.length < 1) {
    return (
      <ErrorScreen
        title="Inga besökta platser"
        subtitle="Du har inte markerat några platser som besökta än"
        showIcon={false}
      />
    );
  }

  return (
    <div className="mx-6 pt-16">
      <h1 className="text-3xl font-bold mb-4">Mina besök</h1>
      <Separator />
      <div className="flex flex-col gap-6 mt-4 max-w-2xl">
        {visitedPlaces.map((place) => {
          return <VisitedPlaceCard key={place.id} place={place} />;
        })}
      </div>
    </div>
  );
}

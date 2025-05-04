"use client";
import { useEffect, useState } from "react";
import { ErrorScreen } from "@/components/ErrorScreen";
import { Separator } from "@/components/ui/separator";
import { FullProfile } from "@/types/FullProfile";
import ProfileCard from "./ProfileCard";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function AdminProfilesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [profiles, setProfiles] = useState<FullProfile[]>();

  async function returnProfiles(): Promise<FullProfile[] | null> {
    try {
      const response = await fetch(`${apiUrl}/admin/profiles`, {
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

  async function getProfiles() {
    setIsLoading(true);
    const profiles = await returnProfiles();
    if (profiles) {
      setProfiles(profiles);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getProfiles();
  }, []);

  if (isLoading) {
    return <p>loading</p>;
  }
  if (profiles == null) {
    return (
      <ErrorScreen
        title="Platserna kunde inte visas"
        subtitle="Försök igen senare"
      />
    );
  }

  if (profiles != null && profiles.length < 1) {
    return (
      <div className="my-auto">
        <ErrorScreen
          title="Inga profiles"
          subtitle="Inga profiler hittades"
          showIcon={false}
        />
      </div>
    );
  }

  return (
    <div className="mx-6 pt-16">
      <h1 className="text-3xl font-bold mb-4">Alla profiler</h1>
      <Separator />
      <div className="flex flex-col gap-6 mt-4 max-w-2xl">
        {profiles.map((profile) => {
          return <ProfileCard key={profile.id} profile={profile} />;
        })}
      </div>
    </div>
  );
}

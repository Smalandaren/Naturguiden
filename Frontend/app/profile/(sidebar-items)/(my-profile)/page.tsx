"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ProfileBasics } from "@/types/ProfileBasics";
import ThemeSwitcher from "@/components/theme-switcher";
import { useEffect, useState } from "react";
import { ErrorScreen } from "@/components/ErrorScreen";
import { Separator } from "@/components/ui/separator";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileBasics>();

  async function returnProfile(): Promise<ProfileBasics | null> {
    try {
      const response = await fetch(`${apiUrl}/profile`, {
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

  async function getProfile() {
    setIsLoading(true);
    const profile = await returnProfile();
    if (profile) {
      setProfile(profile);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getProfile();
  }, []);

  if (isLoading) {
    return <p>loading</p>;
  }
  if (profile == null) {
    return (
      <ErrorScreen
        title="Profilen kunde inte visas"
        subtitle="Försök igen senare"
      />
    );
  }

  return (
    <div className="mx-6 pt-16">
      <h1 className="text-3xl font-bold mb-4">Min profil</h1>
      <Separator />
      <div className="mt-4 max-w-2xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-row gap-6">
            <LabelAndInput title="Förnamn" value={profile.firstName} />
            <LabelAndInput title="Efternamn" value={profile.lastName} />
          </div>
          <LabelAndInput title="E-postadress" value={profile.email} />
        </div>
      </div>
    </div>
  );
}

function LabelAndInput({ title, value }: { title: string; value: string }) {
  return (
    <div className="w-full flex flex-col gap-1">
      <Label className="text-md">{title}</Label>
      <Input
        disabled
        className="h-11 px-4 !text-lg !opacity-100"
        defaultValue={value}
      />
    </div>
  );
}

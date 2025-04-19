"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ProfileBasics } from "@/types/ProfileBasics";
import ThemeSwitcher from "@/components/theme-switcher";
import { useEffect, useState } from "react";
import { ErrorScreen } from "@/components/ErrorScreen";
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
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md p-0">
        <CardHeader className="flex flex-col items-center gap-4 p-2 bg-primary text-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-sm opacity-90">ID: {profile.id}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <Label>Ditt namn</Label>
              <Input
                disabled
                value={`${profile.firstName} ${profile.lastName}`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Din e-post</Label>
              <Input disabled value={profile.email} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Konto skapat</Label>
              <Input
                disabled
                value={format(new Date(profile.createdAt), "d MMMM yyyy")}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

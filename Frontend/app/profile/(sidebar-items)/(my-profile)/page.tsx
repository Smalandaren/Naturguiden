"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileBasics } from "@/types/ProfileBasics";
import { useEffect, useState } from "react";
import { ErrorScreen } from "@/components/ErrorScreen";
import { Separator } from "@/components/ui/separator";
import ProviderIcon from "@/components/ProviderIcon";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Lock, Save } from "lucide-react";
import { toast } from "sonner";
import CenteredLoadingIndicator from "@/components/CenteredLoadingIndicator";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profile, setProfile] = useState<ProfileBasics>();
  const [editedProfile, setEditedProfile] = useState<ProfileBasics>();

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

  async function updateProfile(): Promise<void> {
    try {
      setIsUpdating(true);
      const response = await fetch(`${apiUrl}/profile/update`, {
        cache: "no-cache",
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({
          firstName: editedProfile?.firstName,
          lastName: editedProfile?.lastName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast.error("Ändringarna kunde inte sparas");
      } else {
        const updatedProfile = (await response.json()) as ProfileBasics;
        setProfile(updatedProfile);
        setEditedProfile(updatedProfile);
        toast.success("Ändringar sparade");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  }

  async function getProfile() {
    setIsLoading(true);
    const profile = await returnProfile();
    if (profile) {
      setProfile(profile);
      setEditedProfile(profile);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getProfile();
  }, []);

  if (isLoading) {
    return <CenteredLoadingIndicator />;
  }
  if (profile == null || editedProfile == null) {
    return (
      <ErrorScreen
        title="Profilen kunde inte visas"
        subtitle="Försök igen senare"
      />
    );
  }

  return (
    <div className="mx-6 pt-16">
      <div className="flex flex-row gap-3 items-center mb-4">
        <h1 className="text-3xl font-bold">Min profil</h1>
        <ProviderIcon provider={profile.provider} size={25} />
      </div>
      <Separator />
      <div className="mt-4 max-w-2xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-row gap-6">
            <LabelAndInput
              title="Förnamn"
              value={editedProfile.firstName}
              onChange={(e) => {
                if (!editedProfile) return;
                setEditedProfile({
                  ...editedProfile,
                  firstName: e.target.value,
                });
              }}
            />
            <LabelAndInput
              title="Efternamn"
              value={editedProfile.lastName}
              onChange={(e) => {
                if (!editedProfile) return;
                setEditedProfile({
                  ...editedProfile,
                  lastName: e.target.value,
                });
              }}
            />
          </div>
          <LabelAndInput title="E-postadress" value={profile.email} locked />
          <Button
            onClick={updateProfile}
            disabled={
              JSON.stringify(profile) === JSON.stringify(editedProfile) ||
              isUpdating ||
              editedProfile.firstName.length < 1 ||
              editedProfile.lastName.length < 1
            }
            size="lg"
          >
            {isUpdating ? (
              <LoaderCircle className="animate-spin h-5 w-5" />
            ) : (
              <Save />
            )}
            Spara ändringar
          </Button>
        </div>
      </div>
    </div>
  );
}

function LabelAndInput({
  title,
  value,
  locked,
  onChange,
}: {
  title: string;
  value: string;
  locked?: boolean;
  onChange?: (e: any) => void;
}) {
  return (
    <div className="w-full flex flex-col gap-1">
      <Label className="text-md">
        {title}
        {locked ? <Lock size={15} /> : null}
      </Label>
      <Input
        disabled={locked}
        className="h-11 px-4 !text-lg"
        {...(onChange ? { value, onChange } : { defaultValue: value })}
      />
    </div>
  );
}

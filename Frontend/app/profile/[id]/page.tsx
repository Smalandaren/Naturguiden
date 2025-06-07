import { ErrorScreen } from "@/components/ErrorScreen";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getSessionCookie } from "@/lib/checkAuth";
import { ForeignProfile } from "@/types/ForeignProfile";
import { format, isLastDayOfMonth } from "date-fns";
import { MapPin } from "lucide-react";
import FriendRequestButton from "@/components/FriendRequestButton";
import { checkAuth } from "@/lib/checkAuth";
import { is } from "date-fns/locale";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function getProfile(id: string): Promise<ForeignProfile | null> {
  try {
    const cookie = await getSessionCookie();
    const response = await fetch(`${apiUrl}/profile/${id}`, {
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
    return null;
  }
}

export default async function ViewForeignProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const profile = await getProfile(id);
    if (profile) {
      const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(
        0
      )}`;
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardHeader className="flex flex-col items-center pb-2">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarFallback className="text-xl border-primary border-2">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold text-center">
                {profile.firstName} {profile.lastName}
              </h1>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    Besökt {profile.visitedPlaces}{" "}
                    {profile.visitedPlaces === 1 ? "plats" : "platser"}
                  </span>
                </div>

                <div className="flex items-center justify-center">
                  <FriendRequestButton
                    friendId={profile.id}
                    self={(await checkAuth()).user}
                  ></FriendRequestButton>
                </div>

                <div className="pt-4 border-t text-center text-sm text-muted-foreground">
                  Gick med {format(new Date(profile.createdAt), "d MMMM yyyy")}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    throw new Error("Could not get profile");
  } catch (error: any) {
    console.error("Error:", error.message);
    return (
      <div className="h-screen">
        <ErrorScreen
          title="Ett fel uppstod"
          subtitle="Profilen kunde inte visas. Säkerställ att URL:en är korrekt."
          showBackButton
        />
      </div>
    );
  }
}

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ProfileBasics } from "@/types/ProfileBasics";

export default function Profile({ profile }: { profile: ProfileBasics }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
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

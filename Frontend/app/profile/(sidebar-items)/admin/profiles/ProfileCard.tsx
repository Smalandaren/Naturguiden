import ProviderIcon from "@/components/ProviderIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FullProfile } from "@/types/FullProfile";
import { format } from "date-fns";

export default function ProfileCard({ profile }: { profile: FullProfile }) {
  return (
    <Card className="w-full gap-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-2 items-center">
          <CardTitle className="text-xl font-bold">
            {profile.firstName} {profile.lastName}
          </CardTitle>
          <ProviderIcon provider={profile.provider} size={20} />
        </div>

        {profile.isAdmin && <Badge>Admin</Badge>}
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">E-postadress</p>
          <p className="font-medium">{profile.email}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Registrerad</p>
          <p className="font-medium">
            {format(new Date(profile.createdAt), "d MMMM yyyy")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

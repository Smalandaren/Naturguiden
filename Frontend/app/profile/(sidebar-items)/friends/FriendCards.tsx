import { Friend } from "@/types/Friend";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import AcceptDenyButtons from "@/components/AcceptDenyRequestButtons";
import Link from "next/link";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function FriendCard({friend}: {friend: Friend}) {
    return (    
    <Card className="w-full gap-3">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex flex-row gap-2 items-center">
              <CardTitle className="text-xl font-bold">
                {friend.firstName} {friend.lastName}
              </CardTitle>
            </div>

          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">E-postadress</p>
              <p className="font-medium">{friend.email}</p>
            </div>
    
            <div>
              <p className="text-sm text-muted-foreground">Blev vänner</p>
              <p className="font-medium">
                {format(new Date(friend.confirmedTime), "d MMMM yyyy")}
              </p>
            </div>
          </CardContent>
          </div>

          <div className="flex flex-col items-center px-10 gap-5">
            <Link href={`/profile/${friend.id}`}>
              <Button>Till profil</Button>
            </Link>
          </div>       

        </div>
      </Card>
    );
}

export function FriendReqCard({friend}: {friend: Friend}) {
    return (    
    <Card className="w-full gap-3">
        <div className="flex items-center justify-between">
            <div className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-row gap-2 items-center">
                    <CardTitle className="text-xl font-bold">
                    {friend.firstName} {friend.lastName}
                    </CardTitle>
                </div>

                </CardHeader>
                <CardContent className="space-y-3">
                <div>
                    <p className="text-sm text-muted-foreground">E-postadress</p>
                    <p className="font-medium">{friend.email}</p>
                </div>
        
                <div>
                    <p className="text-sm text-muted-foreground">Förfrågan skickad</p>
                    <p className="font-medium">
                    {format(new Date(friend.requestTime), "d MMMM yyyy")}
                    </p>
                </div>
                </CardContent>
            </div>

            <div className="flex flex-col items-center px-10 gap-5">
              <AcceptDenyButtons friendId={friend.id}/>
            </div>
        </div>
      </Card>
    );
}

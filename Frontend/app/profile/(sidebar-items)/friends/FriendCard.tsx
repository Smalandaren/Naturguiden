import { Friend } from "@/types/Friend";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
    CircleCheck,
    CircleX
  } from "lucide-react";

export function FriendCard({friend}: {friend: Friend}) {
    return (    
    <Card className="w-full gap-3">
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
      </Card>
    );
}

export function FriendReqCard({friend}: {friend: Friend}) {
    return (    
    <Card className="w-full gap-3">
        <div className="flex items-center px-3 gap-3">
            <div>
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

            <div className="flex flex-col items-center gap-5">
                <Button><CircleCheck /></Button>
                <Button><CircleX /></Button>
            </div>
        </div>
      </Card>
    );
}
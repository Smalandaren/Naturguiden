import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Place } from "@/types/Place";
import { TreePine } from "lucide-react";
import Link from "next/link";

export function VisitedPlaceCard({ place }: { place: Place }) {
  return (
    <Card className="w-full">
      <div className="flex items-center px-3 gap-3">
        <TreePine size={30} color="green" />

        <div className="flex-grow min-w-0">
          <h3 className="font-medium text-base truncate">{place.name}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {place.description}
          </p>
        </div>

        <Link href={`/place/${place.id}`}>
          <Button size="sm">Visa platsen</Button>
        </Link>
      </div>
    </Card>
  );
}

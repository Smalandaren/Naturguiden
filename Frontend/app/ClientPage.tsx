"use client";
import Link from "next/link";
import { TreePine } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Place } from "@/types/Place";
import UtilityBadge from "@/components/UtilityBadge";

export default function Home({ places }: { places: Place[] }) {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <div className="flex flex-row items-center justify-center gap-2">
          <h1 className="text-4xl font-bold mb-1">NaturGuiden</h1>
          <TreePine size={40} color="green" />
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Samling av naturplatser i Skåne
        </p>
      </div>

      {places.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Inga naturplatser hittades.</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
          {places.map((place) => (
            <Link href={`/place/${place.id}`} key={place.id}>
              <Card className="w-full gap-0 hover:border-primary transition">
                <CardHeader>
                  <CardTitle className="text-xl">{place.name}</CardTitle>
                  {/* <CardDescription>
                    {place.createdAt.toLocaleString()}
                  </CardDescription> */}
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {place.description}
                  </p>
                  <p className="text-sm mb-4">
                    <span className="font-medium">Koordinater: </span>
                    {place.latitude}, {place.longitude}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-wrap gap-2">
                    {place.placeUtilities.map((utility) => {
                      return (
                        <UtilityBadge
                          key={utility.name}
                          placeUtility={utility}
                        />
                      );
                    })}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

"use client";

import { ArrowLeft, MapPin, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { format } from "date-fns";
import { Place } from "@/types/Place";
import UtilityBadge from "@/components/UtilityBadge";
import RegisterVisitButton from "@/components/RegisterVisitButton"; 
import { ProfileBasics } from "@/types/ProfileBasics";
import Map from "@/components/Map";

export default function NatureSpotDetail({ place, user }: { place: Place, user: ProfileBasics | null }) {
  const openInMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`,
      "_blank"
    );
  };

  return (
    
    <main className="container mx-auto py-8 px-4">
      
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
        crossOrigin=""
      />
      
      {/*<Link href="/">
        <Button
          variant="ghost"
          className="mb-6 pl-2 flex items-center gap-2 hover:cursor-pointer"
        >
          <ArrowLeft size={16} />
          Tillbaka till listan
        </Button>
      </Link>*/}

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6 justify-between">
          <div className="flex gap-3 space-between flex-row">
            <TreePine size={32} color="green" />
            <h1 className="text-3xl font-bold">{place.name}</h1>
          </div>
          <RegisterVisitButton place={place} user={user}></RegisterVisitButton>
        </div>

        <Card className="gap-1">
          <CardHeader>
            <CardTitle className="text-xl">Om platsen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{place.description}</p>

            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-medium mb-2">Bekvämligheter</h3>
                <div className="flex flex-wrap gap-2">
                  {place.placeUtilities.map((utility) => {
                    return (
                      <UtilityBadge key={utility.name} placeUtility={utility} />
                    );
                  })}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Plats</h3>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={16} className="text-muted-foreground" />
                  <span>
                    {place.latitude}, {place.longitude}
                  </span>
                </div>
                <Button
                  onClick={openInMaps}
                  className="w-full sm:w-auto hover:cursor-pointer"
                >
                  Öppna i Google Maps
                </Button>
              </div>

              <div>
                {<Map/>}
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Tillagd</h3>
                <p className="text-muted-foreground">
                  {format(new Date(place.createdAt), "d MMMM yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

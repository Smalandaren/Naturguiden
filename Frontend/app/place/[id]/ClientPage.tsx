"use client";

import { ArrowLeft, MapPin, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { format } from "date-fns";
import { Place } from "@/types/Place";
import RegisterVisitButton from "@/components/RegisterVisitButton";
import { ProfileBasics } from "@/types/ProfileBasics";
import Map from "@/components/Map";
import NextJsMap from "@/components/NextJsMap";
import { Review } from "@/types/Review";


export default function NatureSpotDetail({
  place,
  user,
  reviews,
}: {
  place: Place;
  user: ProfileBasics | null;
  reviews: Review[] | null;
}) {
  const openInMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`,
      "_blank"
    );
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <Link href="/">
        <Button
          variant="ghost"
          className="mb-6 pl-2 flex items-center gap-2 hover:cursor-pointer"
        >
          <ArrowLeft size={16} />
          Tillbaka till listan
        </Button>
      </Link>

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
              {place.categories && place.categories.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Kategorier</h3>
                    <div className="flex flex-wrap gap-2">
                      {place.categories.map((cat) => (
                        <span
                          key={cat.name}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {place.attributes && place.attributes.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Attribut</h3>
                    <div className="flex flex-wrap gap-2">
                      {place.attributes.map((attr) => (
                        <span
                          key={attr.name}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {attr.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {place.imageUrls && place.imageUrls.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Bilder</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {place.imageUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Bild ${index + 1}`}
                          className="rounded-lg border object-cover max-h-60 w-full"
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

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
                <NextJsMap place={place} />
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

        <Card className="gap-5">
          <CardHeader>
            <CardTitle>Recensioner</CardTitle>
          </CardHeader>
          <CardContent>
            {!reviews || reviews.length === 0 ? (
              <h1>{place.name} har inga recensioner än</h1>
            ) : (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader className="flex content-between flex-row flex-wrap">
                    <CardTitle className="w-full text-xl gap-2">
                      <div>{review.userName}</div>
                      ★
                      {review.rating > 1 ? <>★</> : <>☆</>}
                      {review.rating > 2 ? <>★</> : <>☆</>}
                      {review.rating > 3 ? <>★</> : <>☆</>}
                      {review.rating > 4 ? <>★</> : <>☆</>}
                    </CardTitle>
                    <div>{review.comment}</div>
                  </CardHeader>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

"use client";

import { ArrowLeft, MapPin, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { format } from "date-fns";
import { Place } from "@/types/Place";
import { Review } from "@/types/Review";
import UtilityBadge from "@/components/UtilityBadge";
import CategoryBadge from "@/components/CategoryBadge";
import RegisterVisitButton from "@/components/RegisterVisitButton"; 
import WishlistButton from "@/components/WishlistButton"; 
import { ProfileBasics } from "@/types/ProfileBasics";
import Map from "@/components/Map";
import NextJsMap from "@/components/NextJsMap";
import ReviewForm from "@/components/ReviewForm";
import {Star} from "lucide-react"
import { pl } from "date-fns/locale";


export default function NatureSpotDetail({ place, user, reviews }: { place: Place, user: ProfileBasics | null, reviews: Review[] }) {
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

      <div className="max-w-3xl mx-auto flex flex-col gap-3">
        <div className="flex items-center mb-6 justify-between">
          <div className="flex gap-3 space-between flex-row">
            <TreePine size={32} color="green" />
            <h1 className="text-3xl font-bold">{place.name}</h1>
          </div>
          <div className="flex gap-3">
            <WishlistButton place={place} user={user}></WishlistButton>
            <RegisterVisitButton place={place} user={user}></RegisterVisitButton>
          </div>
        </div>

        <Card className="gap-1">
          <CardHeader>
            <CardTitle className="text-xl">Om platsen</CardTitle>
          </CardHeader>
          <CardContent>
            {place.images && place.images.length > 0 && (
              <div className="w-full flex justify-center">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/uploads/${place.images[0]}`}
                  alt="Platsbild"
                  className="max-w-full max-h-[500px] object-contain rounded border"
                />
              </div>
            )}
            <p className="text-muted-foreground mb-6">{place.description}</p>

            <div className="flex flex-col gap-6">
              <div>
                <div className="flex gap-1 flex-wrap">
                  <div className="flex flex-wrap gap-2 w-full">
                    {(place.placeCategories != null) ?
                      (place.placeCategories.map((category) => {
                        return (
                          <CategoryBadge
                            key={category.name}
                            placeCategory={category}
                          />
                        );
                      })) : (<></>)}
                  </div>
                  <div className="flex flex-wrap gap-2 w-full">
                    {(place.placeUtilities != null) ?
                      (place.placeUtilities.map((utility) => {
                        return (
                          <UtilityBadge
                            key={utility.name}
                            placeUtility={utility}
                          />
                        );
                      })) : (<></>)}
                  </div>
                </div>
                {/*
                <h3 className="font-medium mb-2">Bekvämligheter</h3>
                <div className="flex flex-wrap gap-2">
                  {place.placeUtilities.map((utility) => {
                    return (
                    <UtilityBadge key={utility.name} placeUtility={utility} />
                    );
                  })}
                </div>*/}
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
                <NextJsMap place={place}/>
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
            <CardTitle>
              Recensioner
            </CardTitle>
            {user != null ? (<ReviewForm place={place}/>) : (<></>)} {/*Om användaren är inloggad, visa skapa-recensionsformuläret*/}
          
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
          {
          (reviews.length === 0) ? (
                <h1>{place.name} har inga recensioner än</h1>
              ) : (
            reviews.map((review) => 
           <Card key={review.id}>
              <CardHeader className="flex content-between flex-row flex-wrap">
                <CardTitle className="w-full text-xl gap-2">
                  <div><Link href={`/profile/${review.userId}`}>{review.userName}</Link></div>
                  <div className="flex gap-0.5">
                    <Star size={20} fill="green" color="transparent"/>
                    {(review.rating > 1) ? (<Star size={20} fill="green" color="transparent"/>) : (<Star size={20} fill="grey" color="transparent"/>)}
                    {(review.rating > 2) ? (<Star size={20} fill="green" color="transparent"/>) : (<Star size={20} fill="grey" color="transparent"/>)}
                    {(review.rating > 3) ? (<Star size={20} fill="green" color="transparent"/>) : (<Star size={20} fill="grey" color="transparent"/>)}
                    {(review.rating > 4) ? (<Star size={20} fill="green" color="transparent"/>) : (<Star size={20} fill="grey" color="transparent"/>)}
                  </div>
                </CardTitle>
                <div>{review.comment}</div>
              </CardHeader>
            </Card>
            ))} 
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

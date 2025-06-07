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
import AttributeBadge from "@/components/AttributeBadge";
import RegisterVisitButton from "@/components/RegisterVisitButton";
import WishlistButton from "@/components/WishlistButton";
import { ProfileBasics } from "@/types/ProfileBasics";
import Map from "@/components/Map";
import NextJsMap from "@/components/NextJsMap";
import ReviewForm from "@/components/ReviewForm";
import { Star } from "lucide-react";
import { pl, sv } from "date-fns/locale";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

export default function NatureSpotDetail({
  place,
  user,
  initialReviews,
}: {
  place: Place;
  user: ProfileBasics | null;
  initialReviews: Review[];
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const openInMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`,
      "_blank"
    );
  };

  const handleSuccessfulReview = (review: Review) => {
    toast.success("Din recension har publicerats!");
    setReviews((prevReviews) => [review, ...prevReviews]);
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
            <WishlistButton
              place={place}
              user={user}
              text={true}
            ></WishlistButton>
            <RegisterVisitButton
              place={place}
              user={user}
              text={true}
            ></RegisterVisitButton>
          </div>
        </div>

        <Card className="gap-1">
          <CardHeader>
            <CardTitle className="text-xl">Om platsen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{place.description}</p>

            <div className="flex gap-1 flex-wrap mb-6">
              <div className="flex flex-wrap gap-2 w-full">
                {place.placeCategories?.map((category) => (
                  <div key={category.name} className="[&>*]:bg-green-800">
                    <AttributeBadge placeAttribute={category} />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 w-full">
                {place.placeUtilities?.map((utility) => (
                  <AttributeBadge key={utility.name} placeAttribute={utility} />
                ))}
              </div>
            </div>

            {place.images && place.images.length > 0 && (
              <div className="w-full flex justify-center mb-6">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL?.replace(
                    "/api",
                    ""
                  )}/uploads/${place.images[0]}`}
                  alt="Platsbild"
                  className="max-w-full max-h-[500px] object-contain rounded-xl"
                />
              </div>
            )}

            <div className="flex flex-col gap-6">
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
                  {format(new Date(place.createdAt), "d MMMM yyyy", {
                    locale: sv,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="gap-5">
          <CardHeader>
            <CardTitle>Recensioner</CardTitle>
            {user != null ? (
              <ReviewForm
                onSuccess={(review) => handleSuccessfulReview(review)}
                place={place}
              />
            ) : (
              <></>
            )}{" "}
            {/*Om användaren är inloggad, visa skapa-recensionsformuläret*/}
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {reviews.length === 0 ? (
                <h1>{place.name} har inga recensioner än</h1>
              ) : (
                <AnimatePresence>
                  {reviews.map((review) => (
                    <motion.div key={review.id} layout>
                      <Card key={review.id}>
                        <CardHeader className="flex content-between flex-row flex-wrap">
                          <CardTitle className="w-full text-xl gap-2">
                            <div>
                              <Link href={`/profile/${review.userId}`}>
                                {`${review.foreignProfile?.firstName} ${review.foreignProfile?.lastName}`}
                              </Link>
                            </div>
                            <div className="flex gap-0.5">
                              <Star
                                size={20}
                                fill="green"
                                color="transparent"
                              />
                              {review.rating > 1 ? (
                                <Star
                                  size={20}
                                  fill="green"
                                  color="transparent"
                                />
                              ) : (
                                <Star
                                  size={20}
                                  fill="grey"
                                  color="transparent"
                                />
                              )}
                              {review.rating > 2 ? (
                                <Star
                                  size={20}
                                  fill="green"
                                  color="transparent"
                                />
                              ) : (
                                <Star
                                  size={20}
                                  fill="grey"
                                  color="transparent"
                                />
                              )}
                              {review.rating > 3 ? (
                                <Star
                                  size={20}
                                  fill="green"
                                  color="transparent"
                                />
                              ) : (
                                <Star
                                  size={20}
                                  fill="grey"
                                  color="transparent"
                                />
                              )}
                              {review.rating > 4 ? (
                                <Star
                                  size={20}
                                  fill="green"
                                  color="transparent"
                                />
                              ) : (
                                <Star
                                  size={20}
                                  fill="grey"
                                  color="transparent"
                                />
                              )}
                            </div>
                          </CardTitle>
                          <div>{review.comment}</div>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

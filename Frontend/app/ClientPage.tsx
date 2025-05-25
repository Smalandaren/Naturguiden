"use client";

import Link from "next/link";
import { TreePine, Plus } from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Place } from "@/types/Place";
import UtilityBadge from "@/components/UtilityBadge";
import CategoryBadge from "@/components/CategoryBadge";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NextJsFullMap from "@/components/NextJsFullMap";

export default function Home({ places }: { places: Place[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [authenticated, setAuthenticated] = useState(false);

    const filteredPlaces = places.filter(
        (place) =>
            place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            place.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Detta tillåter oss bl.a visa felmeddelande vid Google inloggning. Fråga Thor om mer info.
    useEffect(() => {
        const authError = searchParams.get("authError");
        if (authError) {
            const errorMessages: Record<string, string> = {
                GoogleLoginFailed: "Ett fel uppstod under Google-inloggning",
                GoogleEmailBelongsToExistingAccount:
                    "Google kontots e-postadress är redan kopplad till ett Naturguiden konto",
                GoogleLoginDeniedByUser: "Google-inloggning nekades av användaren",
            };

            const message =
                errorMessages[authError] || "Ett fel inträffade vid inloggning";
            toast.error(message);

            window.history.replaceState({}, document.title, window.location.pathname); // Tar bort felkoden från URL
        }
        
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-auth`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.authenticated) {
                    setAuthenticated(true);
                }
            });
    }, [searchParams]);

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

            <div className="flex flex-col space-y-4 max-w-3xl mx-auto mb-4 items-center">
                <Input type="text"
                    placeholder="Sök"
                    className="hover:border-primary transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}>
              </Input>

                {authenticated && (
                    <Button
                        onClick={() => router.push("/place/create")}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 font-medium text-base px-4 py-2"
                    >
                        <Plus size={18} />
                        Föreslå en ny plats
                    </Button>
                )}
            </div>

            {filteredPlaces.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">Inga naturplatser hittades.</p>
                </div>
            ) : (
                    <div className="flex flex-col space-y-4 max-w-3xl mx-auto">

                    {filteredPlaces.map((place) => (
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
                        })) : (<></>)
                      }
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
                        })) : (<></>)
                      }
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
          <NextJsFullMap places={places}/>
        </div>
      )}
    </main>
  );
}
"use client";

import Link from "next/link";
import { FoldHorizontal, TreePine, Plus} from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Place } from "@/types/Place";
import { useSearchParams, useRouter } from "next/navigation";
import { PlaceAttribute } from "@/types/PlaceAttribute";
import AttributeBadge from "@/components/AttributeBadge";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NextJsFullMap from "@/components/NextJsFullMap";
import RegisterVisitButton from "@/components/RegisterVisitButton";
import WishlistButton from "@/components/WishlistButton";
import {ProfileBasics} from "@/types/ProfileBasics"
import { Label } from "recharts";
import DropDownFilterButton from "@/components/DropDownFilterButton";

export default function Home({ places, availableUtil, availableCategories, user }: { places: Place[], availableUtil : PlaceAttribute[] | null, availableCategories : PlaceAttribute[] | null, user : ProfileBasics | null}) {
  const availableAttributes: PlaceAttribute[] = (availableUtil ?? []).concat(availableCategories ?? []);  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAttributes, setFilteredAttributes] = useState(availableAttributes?.map((attribute) => ({name: attribute.name, checked: false})));
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  const filteredPlaces = places.filter(
    (place) =>
      CheckSearch(place)
  );

  function CheckSearch(place: Place): boolean {
    if (IsFiltered() && searchTerm == "") {
      return CheckFilter(place.placeUtilities) || CheckFilter(place.placeCategories);
    }

    if (searchTerm != "" && IsFiltered()) {
      return (place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (CheckFilter(place.placeUtilities) || CheckFilter(place.placeCategories));
    }

    if (!IsFiltered() && searchTerm != "") {
      return (place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return true; 
  }

  function IsFiltered(): boolean {
    var isFiltered = false;

    filteredAttributes?.forEach(element => {
      if (element.checked) {
        isFiltered = true;
      }
    });
    return isFiltered;
  }

 function CheckFilter(placeAttributes: PlaceAttribute[]): boolean {
  var yes = false;
  
  placeAttributes.forEach(attribute => {
    filteredAttributes?.forEach(element => {
      if (attribute.name === element.name && element.checked) {
        yes = true;
      }
    });
  });

  return yes;
 }

 function updateFilter(name: string) {
      setFilteredAttributes(
        filteredAttributes?.map((attribute) =>
          attribute.name === name
            ? { ...attribute, checked: !attribute.checked }
            : attribute
      )
    )
 }

 function AuthErrorFunction(){
  const searchParams = useSearchParams();

 return <>{
  
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
    }, [searchParams])}
    </>
 }


    return (
        <main className="container mx-auto py-8 px-4">
                 <Suspense><AuthErrorFunction></AuthErrorFunction></Suspense>
            <div className="text-center mb-10">
                <div className="flex flex-row items-center justify-center gap-2">
                    <h1 className="text-4xl font-bold mb-1">NaturGuiden</h1>
                    <TreePine size={40} color="green" />
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Samling av naturplatser i Skåne
                </p>
            </div>

      <div className="flex fex-col flex-wrap justify-center space-y-4 max-w-3xl mx-auto mb-4 gap-2">
        <div className="flex flex-row w-full gap-1">
        <DropDownFilterButton utilities={availableUtil} categories={availableCategories} handleChange={updateFilter}/>

        <Input type="text"          
          placeholder="Sök"
          className="hover:border-primary transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}>
        </Input>
        </div>
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
                <CardHeader className="flex justify-between">
                  <CardTitle className="text-xl">{place.name}</CardTitle>
                  <div className="flex gap-3">
                          <WishlistButton place={place} user={user}></WishlistButton>
                          <RegisterVisitButton place={place} user={user}></RegisterVisitButton>
                        </div>
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
                            <AttributeBadge
                              key={category.name}
                              placeAttribute={category}
                            />
                          );
                        })) : (<></>)
                      }
                    </div>
                    <div className="flex flex-wrap gap-2 w-full">
                      {(place.placeUtilities != null) ?
                        (place.placeUtilities.map((utility) => {
                          return (
                            <AttributeBadge
                              key={utility.name}
                              placeAttribute={utility}
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
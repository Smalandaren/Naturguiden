"use client";

import Link from "next/link";
import { TreePine, Plus} from "lucide-react";
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
import { useEffect } from "react";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NextJsFullMap from "@/components/NextJsFullMap";
import RegisterVisitButton from "@/components/RegisterVisitButton";
import WishlistButton from "@/components/WishlistButton";
import {ProfileBasics} from "@/types/ProfileBasics"
import DropDownFilterButton from "@/components/DropDownFilterButton";

export default function Home({ places, availableUtil, availableCategories, user }: { places: Place[], availableUtil : PlaceAttribute[] | null, availableCategories : PlaceAttribute[] | null, user : ProfileBasics | null}) {
  const availableAttributes: PlaceAttribute[] = (availableUtil ?? []).concat(availableCategories ?? []);  
  const searchParams = useSearchParams();
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
      if (CheckFilter(place.placeUtilities) + CheckFilter(place.placeCategories) == IsFiltered()) { return true; }

      return false;
    }

    if (searchTerm != "" && IsFiltered()) {
      var x = false;
      if (CheckFilter(place.placeUtilities) + CheckFilter(place.placeCategories) == IsFiltered()) 
        {x = true;}

      return (place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase())) && x;
    }

    if (!IsFiltered() && searchTerm != "") {
      return (place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return true; 
  }

  function IsFiltered(): number {
    var isFiltered = 0;

    filteredAttributes?.forEach(element => {
      if (element.checked) {
        isFiltered++;
      }
    });

    return isFiltered;
  }

 function CheckFilter(placeAttributes: PlaceAttribute[]): number {
  var count = 0;
  
  placeAttributes.forEach(attribute => {
    filteredAttributes?.forEach(element => {
      if (attribute.name === element.name && element.checked) {
        count++;
      }
    });
  });

  return count;
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
        <main className="mx-auto py-8">
            <div className="text-center mb-10">
                <div className="flex flex-row items-center justify-center gap-2">
                    <h1 className="text-4xl font-bold mb-1">NaturGuiden</h1>
                    <TreePine size={40} color="green" />
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Samling av naturplatser i Skåne
                </p>
            </div>

      <div className="w-full">
        <NextJsFullMap places={places}/>
      </div>

      <div className="flex fex-col flex-wrap justify-center space-y-4 max-w-4xl mx-auto p-4 gap-2">
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
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4 grid-cols-1 max-w-4xl mx-auto p-4">
          {filteredPlaces.map((place) => (
            <Link href={`/place/${place.id}`} key={place.id}>
              <Card className="w-full h-full gap-0 py-0 pb-6 hover:border-primary transition relative">
                  <div className="absolute flex gap-2 top-2 right-2">
                      <WishlistButton place={place} user={user} text={false}></WishlistButton>
                      <RegisterVisitButton place={place} user={user} text={false}></RegisterVisitButton>
                  </div>
                        <img
                            src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/uploads/${place.images[0]}`}
                            alt="Platsbild"
                            className="max-w-full h-70/100 object-cover rounded-t-xl pb-2"
                        />
                <CardHeader className="flex justify-between">
                  <CardTitle className="text-xl">{place.name}</CardTitle>

                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {place.description.length > 45 ? 
                      (place.description.substring(0, 45) + "…") : 
                      (place.description)  
                    }
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-1 flex-wrap">
                    <div className="flex flex-wrap gap-2 w-full">
                      {(place.placeCategories != null) ?
                        (place.placeCategories.map((category) => {
                          return (
                          <div key={category.name} className="[&>*]:bg-green-800">
                            <AttributeBadge
                              placeAttribute={category}
                            />
                          </div>
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
        </div>
      )}
    </main>
  );
}
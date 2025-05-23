"use client";
import Link from "next/link";
import { FoldHorizontal, TreePine } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Place } from "@/types/Place";
import { PlaceAttribute } from "@/types/PlaceAttribute";
import AttributeBadge from "@/components/AttributeBadge";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import NextJsFullMap from "@/components/NextJsFullMap";
import { Label } from "recharts";
import DropDownFilterButton from "@/components/DropDownFilterButton";

export default function Home({ places, availableUtil, availableCategories }: { places: Place[], availableUtil : PlaceAttribute[] | null, availableCategories : PlaceAttribute[] | null }) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUtil, setFilteredUtil] = useState(availableUtil?.map((util) => ({name: util.name, checked: false})));

  const filteredPlaces = places.filter(
    (place) =>
      CheckSearch(place)
  );

  function CheckSearch(place: Place): boolean {
    if (IsFiltered() && searchTerm == "") {
      return CheckFilter(place.placeUtilities);
    }

    if (searchTerm != "" && IsFiltered()) {
      return (place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      CheckFilter(place.placeUtilities);
    }

    if (!IsFiltered() && searchTerm != "") {
      return (place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return true; 
  }

  function IsFiltered(): boolean {
    var isFiltered = false;

    filteredUtil?.forEach(element => {
      if (element.checked) {
        isFiltered = true;
      }
    });
    return isFiltered;
  }

 function CheckFilter(placeUtilities: PlaceAttribute[]): boolean {
  var yes = false;
  
  placeUtilities.forEach(util => {
    filteredUtil?.forEach(element => {
      if (util.name === element.name && element.checked) {
        yes = true;
      }
    });
  });

  return yes;
 }

 function updateFilter(name: string) {
      setFilteredUtil(
        filteredUtil?.map((util) =>
          util.name === name
            ? { ...util, checked: !util.checked }
            : util
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

      <div className="flex space-y-4 max-w-3xl mx-auto mb-4 gap-2">
        <DropDownFilterButton utilities={availableUtil} categories={availableCategories} handleChange={updateFilter}/>

        <Input type="text"          
          placeholder="Sök"
          className="hover:border-primary transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}>
        </Input>
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

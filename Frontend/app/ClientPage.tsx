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
import { PlaceUtility } from "@/types/PlaceUtility";
import UtilityBadge from "@/components/UtilityBadge";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import NextJsFullMap from "@/components/NextJsFullMap";
import { Label } from "recharts";

export default function Home({ places, availableUtil }: { places: Place[], availableUtil : PlaceUtility[] | null }) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUtil, setFilteredUtil] = useState(availableUtil?.map((util) => ({name: util.name, checked: false})));

  const filteredPlaces = places.filter(
    (place) =>
      CheckSearch(place)
  );

  function CheckSearch(place: Place): boolean {
    if (IsFiltered() && searchTerm == "") {
      console.log("Filter och inget sökt")
      return CheckFilter(place.placeUtilities);
    }

    if (searchTerm != "" && IsFiltered()) {
      console.log("Filter och något sökt")
      return (place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      CheckFilter(place.placeUtilities);
    }

    if (!IsFiltered() && searchTerm != "") {
      console.log("Inget filter och något sökt")
      return (place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return true; 
  }

  function IsFiltered(): boolean {
    var isFiltered = false;

    filteredUtil?.forEach(element => {
      if (element.checked) {
        console.log(element.name)
        isFiltered = true;
      }
    });

    console.log(isFiltered  )
    return isFiltered;
  }

 function CheckFilter(placeUtilities: PlaceUtility[]): boolean {
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

      <div className="flex flex-col space-y-4 max-w-3xl mx-auto mb-4">        
        <Input type="text"          
          placeholder="Sök"
          className="hover:border-primary transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}>
        </Input>
      
        <Card className="w-full gap-0 hover:border-primary transition">
          <CardHeader>
            <CardTitle className="text-xl">
              Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availableUtil?.map((util) => (
              <div key={util.name} className="flex justify-between items-center">
                  <h1>{util.name}</h1>
                  <input 
                    type="checkbox"
                    onChange={() => updateFilter(util.name)}
                  />
              </div>
            ))}
          </CardContent>
        </Card>
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
          <NextJsFullMap places={places}/>
        </div>
      )}
    </main>
  );
}

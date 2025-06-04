"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Input } from "@/components/ui/input";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type Place = {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string;
  createdAt: string;
  placeUtilities: { name: string }[];
  placeCategories: { name: string }[];
  images?: string[];
};

export default function AdminPlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPlaces = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/places/pending`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Kunde inte hämta platsförslag");

      const data = await res.json();
      const sanitized = data.map((place: any) => ({
        ...place,
        placeUtilities: place.placeUtilities ?? [],
        placeCategories: place.placeCategories ?? [],
        images: place.images ?? [],
      }));
      setPlaces(sanitized);
    } catch (error) {
      toast.error("Kunde inte hämta platsförslag");
    } finally {
      setIsLoading(false);
    }
  };

  const approvePlace = async (id: number) => {
    try {
      const res = await fetch(`${apiUrl}/places/${id}/approve`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      toast.success("Platsförslag godkänt");
      fetchPlaces();
    } catch {
      toast.error("Kunde inte godkänna platsförslag");
    }
  };

  const deletePlace = async (id: number) => {
    try {
      const res = await fetch(`${apiUrl}/places/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      toast.success("Platsförslag nekades");
      fetchPlaces();
    } catch {
      toast.error("Kunde inte neka platsförslag");
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const filteredPlaces = places.filter((place) =>
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-6 pt-16">
      <h1 className="text-3xl font-bold mb-4">Platsförslag</h1>
      <Separator className="mb-6" />

      <div className="max-w-md mb-6">
      <Input type="text"
        placeholder="Sök"
        className="hover:border-primary transition"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}>
      </Input>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPlaces.length === 0 ? (
        <p className="text-muted-foreground">Inga nya platsförslag att visa.</p>
      ) : (
        <div className="flex flex-col gap-6 mt-4 max-w-4xl">
          {filteredPlaces.map((place) => (
            <Card key={place.id}>
              <CardHeader>
                <CardTitle className="text-xl">{place.name}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {place.address || "Ingen adress angiven"}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {place.images && place.images.length > 0 ? (
                  <div className="w-full flex justify-center">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/uploads/${place.images[0]}`}
                      alt={`Bild av ${place.name}`}
                      className="max-w-full max-h-[500px] object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg">
                    <span className="text-muted-foreground">Ingen bild tillgänglig</span>
                  </div>
                )}

                <p className="text-sm">{place.description}</p>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Koordinater:</span> {place.latitude}, {place.longitude}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Skickad:</span> {format(new Date(place.createdAt), "d MMMM yyyy", { locale: sv })}
                  </p>
                </div>

                {place.placeCategories.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-1">Kategorier:</p>
                    <div className="flex flex-wrap gap-2">
                      {place.placeCategories.map((c, index) => (
                        <Badge key={index} variant="default">
                          {c.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {place.placeUtilities.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-1">Bekvämligheter:</p>
                    <div className="flex flex-wrap gap-2">
                      {place.placeUtilities.map((u, index) => (
                        <Badge key={index} variant="default">
                          {u.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-end gap-2">
                <Button 
                  onClick={() => approvePlace(place.id)} 
                  size="sm"
                  variant="default"
                >
                  Godkänn
                </Button>
                <Button
                  onClick={() => deletePlace(place.id)}
                  size="sm"
                  variant="destructive"
                >
                  Neka
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

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
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableUtilities, setAvailableUtilities] = useState<string[]>([]);

  const fetchPlaces = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/places/pending`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Kunde inte hämta platsförslag");
      const data = await res.json();
      setPlaces(
        data.map((place: any) => ({
          ...place,
          placeUtilities: place.placeUtilities ?? [],
          placeCategories: place.placeCategories ?? [],
          images: place.images ?? [],
        }))
      );
    } catch {
      toast.error("Kunde inte hämta platsförslag");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailable = async () => {
    try {
      const [catRes, utilRes] = await Promise.all([
        fetch(`${apiUrl}/categories`, { credentials: "include" }),
        fetch(`${apiUrl}/utilities`, { credentials: "include" }),
      ]);
      if (catRes.ok)
        setAvailableCategories((await catRes.json()).map((c: any) => c.name));
      if (utilRes.ok)
        setAvailableUtilities((await utilRes.json()).map((u: any) => u.name));
    } catch {
      toast.error("Kunde inte hämta kategorier eller attribut");
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
    fetchAvailable();
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
                      src={`${apiUrl.replace("/api", "")}/uploads/${place.images[0]}`}
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
                <Button onClick={() => approvePlace(place.id)} size="sm">
                  Godkänn
                </Button>
                <Button onClick={() => deletePlace(place.id)} size="sm" variant="destructive">
                  Neka
                </Button>

                <Dialog
                  open={editingPlace?.id === place.id}
                  onOpenChange={(open) => !open && setEditingPlace(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setEditingPlace(place)}
                      size="sm"
                      variant="outline"
                    >
                      Redigera
                    </Button>
                  </DialogTrigger>

                  {editingPlace && (
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Redigera {editingPlace.name}</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const res = await fetch(`${apiUrl}/places/${editingPlace.id}`, {
                            method: "PUT",
                            credentials: "include",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              name: editingPlace.name,
                              description: editingPlace.description,
                              coordinates: `${editingPlace.latitude},${editingPlace.longitude}`,
                              categoryNames: editingPlace.placeCategories.map((c) => c.name),
                              attributeNames: editingPlace.placeUtilities.map((u) => u.name),
                              images: editingPlace.images ?? [],
                            }),
                          });
                          if (res.ok) {
                            toast.success("Plats uppdaterad");
                            setEditingPlace(null);
                            fetchPlaces();
                          } else {
                            toast.error("Kunde inte uppdatera plats");
                          }
                        }}
                      >
                        <Input
                          className="mb-2"
                          value={editingPlace.name}
                          onChange={(e) =>
                            setEditingPlace({ ...editingPlace, name: e.target.value })
                          }
                          placeholder="Namn"
                        />
                        <Input
                          className="mb-2"
                          value={editingPlace.description}
                          onChange={(e) =>
                            setEditingPlace({ ...editingPlace, description: e.target.value })
                          }
                          placeholder="Beskrivning"
                        />
                        <Input
                          className="mb-2"
                          value={`${editingPlace.latitude},${editingPlace.longitude}`}
                          onChange={(e) => {
                            const [lat, lng] = e.target.value.split(",");
                            setEditingPlace({
                              ...editingPlace,
                              latitude: parseFloat(lat),
                              longitude: parseFloat(lng),
                            });
                          }}
                          placeholder="Koordinater (lat,lng)"
                        />
                        <div className="mb-2">
                          <p className="font-semibold">Kategorier:</p>
                          {availableCategories.map((name) => (
                            <label key={name} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={
                                  editingPlace.placeCategories.some((c) => c.name === name)
                                }
                                onChange={(e) => {
                                  const current = editingPlace.placeCategories.map((c) => c.name);
                                  const updated = e.target.checked
                                    ? [...current, name]
                                    : current.filter((n) => n !== name);
                                  setEditingPlace({
                                    ...editingPlace,
                                    placeCategories: updated.map((n) => ({ name: n })),
                                  });
                                }}
                              />
                              <span>{name}</span>
                            </label>
                          ))}
                        </div>
                        <div className="mb-4">
                          <p className="font-semibold">Bekvämligheter:</p>
                          {availableUtilities.map((name) => (
                            <label key={name} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={
                                  editingPlace.placeUtilities.some((u) => u.name === name)
                                }
                                onChange={(e) => {
                                  const current = editingPlace.placeUtilities.map((u) => u.name);
                                  const updated = e.target.checked
                                    ? [...current, name]
                                    : current.filter((n) => n !== name);
                                  setEditingPlace({
                                    ...editingPlace,
                                    placeUtilities: updated.map((n) => ({ name: n })),
                                  });
                                }}
                              />
                              <span>{name}</span>
                            </label>
                          ))}
                        </div>
                        <div className="mb-4">
                          <p className="font-semibold">Nuvarande bild:</p>
                          {editingPlace.images?.[0] ? (
                            <div className="mb-2">
                              <img
                                src={`${apiUrl.replace("/api", "")}/uploads/${editingPlace.images[0]}`}
                                alt="Bild"
                                className="w-full max-h-64 object-cover rounded border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                className="mt-2"
                                onClick={() => {
                                  setEditingPlace({ ...editingPlace, images: [] });
                                }}
                              >
                                Ta bort bild
                              </Button>
                            </div>
                          ) : (
                            <p className="text-muted-foreground mb-2">Ingen bild vald</p>
                          )}
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file && editingPlace) {
                                const formData = new FormData();
                                formData.append("file", file);
                                fetch(`${apiUrl}/places/${editingPlace.id}/upload-image`, {
                                  method: "POST",
                                  credentials: "include",
                                  body: formData,
                                })
                                  .then(async (res) => {
                                    if (res.ok) {
                                      const { filename } = await res.json();
                                      setEditingPlace({
                                        ...editingPlace,
                                        images: [filename],
                                      });
                                      toast.success("Bild uppladdad");
                                    } else {
                                      toast.error("Kunde inte ladda upp bild");
                                    }
                                  })
                                  .catch(() => toast.error("Fel vid bilduppladdning"));
                              }
                            }}
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit">Spara</Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setEditingPlace(null)}
                          >
                            Avbryt
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  )}
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import "@/app/globals.css";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function LocationPicker({ setCoordinates }: { setCoordinates: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      setCoordinates(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export default function CreatePlaceForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    address: "",
    categoryNames: [] as string[],
    utilityNames: [] as string[],
  });

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    key: "categoryNames" | "utilityNames",
    value: string
  ) => {
    setForm((prev) => {
      const list = prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value];
      return { ...prev, [key]: list };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!form.name || form.name.length < 3) {
        throw new Error("Namn måste vara minst 3 tecken långt.");
      }

      const lat = parseFloat(form.latitude);
      const lon = parseFloat(form.longitude);

        if (isNaN(parseFloat(form.latitude))) {
        throw new Error("Latitud saknas eller är ogiltig. Ange ett korrekt decimaltal.");
      }

        if (isNaN(parseFloat(form.longitude))) {
        throw new Error("Longitud saknas eller är ogiltig. Ange ett korrekt decimaltal.");
      }

      if (lat < 55.3 || lat > 56.5 || lon < 12.5 || lon > 14.5) {
        throw new Error("Platsen verkar inte ligga inom Skåne. Kontrollera koordinaterna.");
      }

      const res = await fetch(`${apiUrl}/places`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
        }),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || "Ett fel uppstod vid skapande av plats.");
      }

      const placeId = await res.json();

      if (image) {
        const uploadToast = toast.loading("Laddar upp bild...");
        try {
          const formData = new FormData();
          formData.append("file", image);

            const uploadRes = await fetch(
            `${apiUrl}/places/${placeId}/upload-image`,
            {
            method: "POST",
            credentials: "include",
            body: formData,
            }
          );

          if (!uploadRes.ok) throw new Error("Bilden kunde inte laddas upp");
          toast.success("Bilden uppladdad!", { id: uploadToast });
        } catch (error) {
          toast.error("Bilden kunde inte laddas upp", { id: uploadToast });
          throw error;
        }
      }

      toast.success("Platsförslag skickat! Det kommer att granskas av en admin innan det publiceras.");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mx-6 pt-6">
        <Link href="/">
          <Button variant="ghost" className="pl-2 flex items-center gap-2">
            <ArrowLeft size={16} />
            Tillbaka till listan
          </Button>
        </Link>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-card text-card-foreground max-w-xl mx-auto mt-6 p-6 pb-10 rounded-xl border border-border space-y-6"
      >
        <h2 className="text-2xl font-bold">Föreslå en ny plats</h2>

        <p className="text-sm text-muted-foreground">
          Fält markerade med <span className="text-red-500">*</span> är obligatoriska.
        </p>

        <div className="space-y-2">
          <Label htmlFor="name">Platsens namn <span className="text-red-500">*</span></Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Beskrivning <span className="text-red-500">*</span></Label>
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
           <Label htmlFor="address">Adress</Label>
           <Input
             name="address"
             value={form.address}
             onChange={handleChange}
           />
         </div>

        <div className="space-y-2">
          <Label>Välj plats på karta</Label>
          <MapContainer center={[56.0, 13.5]} zoom={8} style={{ height: "300px", borderRadius: "8px" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationPicker
              setCoordinates={(lat, lng) => {
                setForm((prev) => ({
                  ...prev,
                  latitude: lat.toString(),
                  longitude: lng.toString(),
                }));
              }}
            />
            {form.latitude && form.longitude && (
              <Marker position={[parseFloat(form.latitude), parseFloat(form.longitude)]} />
            )}
          </MapContainer>
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2 space-y-2">
            <Label htmlFor="latitude">Latitud <span className="text-red-500">*</span></Label>
            <Input
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              type="number"
              step="any"
              required
              className="no-spinner"
            />
          </div>
          <div className="w-1/2 space-y-2">
            <Label htmlFor="longitude">Longitud <span className="text-red-500">*</span></Label>
            <Input
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              type="number"
              step="any"
              required
              className="no-spinner"/>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-1">Kategorier</h3>
          <div className="space-y-1">
            {["Skog", "Sjö", "Höjder", "Naturreservat"].map((cat) => (
              <label key={cat} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.categoryNames.includes(cat)}
                  onChange={() => handleCheckboxChange("categoryNames", cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-1">Bekvämligheter</h3>
          <div className="space-y-1">
              {["Toalett", "Utsiktsplats", "Parkering", "Vandringsleder"].map(
              (attr) => (
              <label key={attr} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.utilityNames.includes(attr)}
                  onChange={() => handleCheckboxChange("utilityNames", attr)}
                />
                {attr}
              </label>
            )
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Ladda upp en bild</Label>
          <div className="flex items-center gap-4">
            <Button asChild type="button">
              <label htmlFor="file-upload" className="cursor-pointer">
                Välj bild
              </label>
            </Button>
            <span className="text-sm text-muted-foreground">
              {image ? image.name : "Ingen bild vald"}
            </span>
          </div>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setImage(e.target.files[0]);
                setPreviewUrl(URL.createObjectURL(e.target.files[0]));
              }
            }}
          />
          {previewUrl && (
            <div className="mt-2 space-y-2">
              <img
                src={previewUrl}
                alt="Förhandsvisning"
                className="max-h-64 rounded-lg border border-muted-foreground/20"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setImage(null);
                  setPreviewUrl(null);
                }}
              >
                Ta bort bild
              </Button>
            </div>
          )}
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Skickar..." : "Skicka"}
        </Button>
      </form>
      <div className="h-10" />
    </>
  );
}
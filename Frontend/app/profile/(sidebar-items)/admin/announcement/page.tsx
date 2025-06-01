"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { AnnouncementBanner } from "@/types/AnnouncementBanner";
import { useEffect, useState } from "react";
import Banner from "@/components/Banner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const defaultBanner: AnnouncementBanner = {
  title: "Standardmeddelande",
  subtitle: "",
  type: "information",
  showButton: false,
  buttonText: "",
  buttonLink: "",
  isActive: false,
};

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<AnnouncementBanner>(defaultBanner);

  async function returnBanner(): Promise<AnnouncementBanner | null> {
    try {
      const response = await fetch(`${apiUrl}/admin/announcement`, {
        cache: "no-cache",
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function handleSave() {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/admin/announcement`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(banner),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        toast.success("Meddelande uppdaterat");
      } else {
        throw new Error("Ett fel uppstod");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
    setIsLoading(false);
  }

  async function getBanner() {
    setIsLoading(true);
    const result = await returnBanner();
    if (result) {
      setBanner(result);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getBanner();
  }, []);

  if (isLoading) {
    return <p>loading</p>;
  }

  return (
    <div className="mx-6 pt-16">
      <div className="flex flex-row gap-3">
        <h1 className="text-3xl font-bold mb-4">Viktigt meddelande</h1>
        <Button onClick={handleSave}>Spara ändringar</Button>
      </div>
      <Separator />
      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <LiveSwitch
            checked={banner.isActive}
            onCheckedChange={(v) => setBanner({ ...banner, isActive: v })}
          />

          <LabelAndInput
            title="Titel"
            value={banner.title}
            onChange={(v) => setBanner({ ...banner, title: v })}
          />

          <LabelAndInput
            title="Undertitel"
            value={banner.subtitle || ""}
            onChange={(v) => setBanner({ ...banner, subtitle: v })}
          />

          <LabelAndSelect
            title="Typ"
            value={banner.type}
            options={["information", "danger"]}
            onChange={(val) => setBanner({ ...banner, type: val })}
          />

          <div className="flex items-center gap-4">
            <Label className="text-lg">Visa knapp</Label>
            <Switch
              checked={banner.showButton}
              onCheckedChange={(v) => setBanner({ ...banner, showButton: v })}
            />
          </div>

          {banner.showButton ? (
            <>
              <LabelAndInput
                title="Knapptext"
                value={banner.buttonText || ""}
                onChange={(v) => setBanner({ ...banner, buttonText: v })}
              />
              <LabelAndInput
                title="Knapplänk (/example/123)"
                value={banner.buttonLink || ""}
                onChange={(v) => setBanner({ ...banner, buttonLink: v })}
              />
            </>
          ) : null}
        </div>

        <div className="w-full lg:w-1/2 border rounded-lg p-4 flex flex-col gap-4">
          <h1 className="text-xl font-semibold">Förhandsvisning:</h1>
          <Banner data={banner} />
        </div>
      </div>
    </div>
  );
}

function LabelAndInput({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="w-full flex flex-col gap-1">
      <Label className="text-md">{title}</Label>
      <Input
        className="h-11 px-4 !text-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function LabelAndSelect({
  title,
  value,
  options,
  onChange,
}: {
  title: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  return (
    <div className="w-full flex flex-col gap-1">
      <Label className="text-md">{title}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 w-full px-4 !text-lg">
          <SelectValue placeholder="Välj ett alternativ" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option} className="!text-lg">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function LiveSwitch({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-row items-center bg-card justify-between rounded-lg border p-4 mb-4 w-full">
      <div className="w-2/3">
        <Label className="text-base">Aktivera meddelandet</Label>
        <p className="text-sm text-muted-foreground">
          Meddelandet kommer visas på alla sidor, för alla besökare
        </p>
      </div>
      <div>
        <Switch checked={checked} onCheckedChange={(v) => onCheckedChange(v)} />
      </div>
    </div>
  );
}

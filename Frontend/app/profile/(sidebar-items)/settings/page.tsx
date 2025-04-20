"use client";
import { Separator } from "@/components/ui/separator";
import ThemePicker from "./ThemePicker";

export default function SettingsPage() {
  return (
    <div className="mx-6 pt-16">
      <h1 className="text-3xl font-bold mb-4">Inställningar</h1>
      <Separator />
      <div className="mt-4">
        <ThemePicker />
      </div>
    </div>
  );
}

'use client'
import dynamic from "next/dynamic";
import { Place } from "@/types/Place";

// Gör om FullMap till klientkomponent

const FullMap = dynamic(() => import("./FullMap"), {
  // Stoppar server-side rendering
  ssr: false,
});

export default function NextJsFullMap({ places }: { places: Place[] }) {
  return <FullMap places={places} />;
}
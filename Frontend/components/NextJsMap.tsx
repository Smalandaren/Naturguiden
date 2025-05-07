'use client'
import dynamic from "next/dynamic";
import { Place } from "@/types/Place";

// Gör om Map till klientkomponent

const Map = dynamic(() => import("./Map"), {
  // Stoppar server-side rendering
  ssr: false,
});

export default function NextJsMap({ place }: { place: Place }) {
  return <Map place={place} />;
}
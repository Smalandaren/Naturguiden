'use client'
import dynamic from "next/dynamic";

// Gör om Map till klientkomponent
export const NextJsMap = dynamic(
  () => import("./Map")
    .then((mod) => mod.default),
  {
    // Stoppar server-side rendering
    ssr: false,
  }
);

export default function NextJsMapexport(){
  return <NextJsMap/>;
}
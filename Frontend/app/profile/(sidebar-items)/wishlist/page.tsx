"use client";
import { ProfileBasics } from "@/types/ProfileBasics";
import { useEffect, useState } from "react";
import { ErrorScreen } from "@/components/ErrorScreen";
import { Separator } from "@/components/ui/separator";
import { WishlistCard } from "./WishlistCard";
import { Place } from "@/types/Place";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<Place[]>();

  async function returnWishlistItems(): Promise<Place[] | null> {
    try {
      const response = await fetch(`${apiUrl}/wishlist`, {
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

  async function getWishlistItems() {
    setIsLoading(true);
    const places = await returnWishlistItems();
    if (places) {
      setWishlistItems(places);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getWishlistItems();
  }, []);

  if (isLoading) {
    return <p>loading</p>;
  }
  if (wishlistItems == null) {
    return (
      <ErrorScreen
        title="Platserna kunde inte visas"
        subtitle="Försök igen senare"
      />
    );
  }

  if (wishlistItems != null && wishlistItems.length < 1) {
    return (
      <ErrorScreen
        title="Wishlisten är tom"
        subtitle="Du har inte lagt till några platser på din wishlist än"
        showIcon={false}
      />
    );
  }

  return (
    <div className="mx-6 pt-16">
      <h1 className="text-3xl font-bold mb-4">Min wishlist</h1>
      <Separator />
      <div className="flex flex-col gap-6 mt-4 max-w-2xl">
        {wishlistItems.map((place) => {
          return <WishlistCard key={place.id} place={place} />;
        })}
      </div>
    </div>
  );
}

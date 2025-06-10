import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Place } from "@/types/Place";
import { ProfileBasics } from "@/types/ProfileBasics";
import { Star } from "lucide-react";
import { toast } from "sonner";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterVisitButton({
  place,
  user,
  text,
}: {
  place: Place;
  user: ProfileBasics | null;
  text: boolean;
}) {
  const [onWishlist, setOnWishlist] = useState(Boolean);

  useEffect(() => {
    GetOnWishlist().then((val) => setOnWishlist(val));
  });

  async function GetOnWishlist(): Promise<boolean> {
    try {
      if (user === null) {
        return false;
      }

      const response = await fetch(`${apiUrl}/wishlist/check`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          UserId: user.id,
          PlaceId: place.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Ett fel uppstod`);
      }

      const json = await response.json();
      return json;
    } catch (error: any) {
      console.log(error);
      return false;
    }
  }

  async function HandleClick() {
    if (onWishlist == false && user != null) {
      try {
        const response = await fetch(`${apiUrl}/wishlist/add`, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            PlaceId: place.id,
            UserId: user.id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setOnWishlist(true);
          toast.success("Platsen har lagts till i din wishlist");
        }

        if (!response.ok) {
          throw new Error(`Ett fel uppstod`);
        }
      } catch (error: any) {
        toast.error("Platsen kunde inte läggas till i din wishlist");
        console.log(error);
      }
    } else if (onWishlist == true && user != null) {
      try {
        const response = await fetch(`${apiUrl}/wishlist/remove`, {
          method: "DELETE",
          credentials: "include",
          body: JSON.stringify({
            PlaceId: place.id,
            UserId: user.id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setOnWishlist(false);
          toast.success("Platsen har tagits bort från din wishlist");
        }

        if (!response.ok) {
          throw new Error(`Ett fel uppstod`);
        }
      } catch (error: any) {
        toast.error("Platsen kunde inte tas bort från din wishlist");
        console.log(error);
      }
    }
  }

  return (
    <>
      {user === null ? (
        <></>
      ) : (
        <Button
          onClick={(event) => {
            event.preventDefault();
            HandleClick();
          }}
        >
          {text == true ? <>Wishlist</> : <></>}{" "}
          {onWishlist == false ? (
            <>
              <Star />
            </>
          ) : (
            <>
              <Star fill="white" />
            </>
          )}
        </Button>
      )}
    </>
  );
}

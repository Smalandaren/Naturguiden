import { useState } from "react";
import { Button } from "./ui/button";
import { Place } from "@/types/Place";
import { ProfileBasics } from "@/types/ProfileBasics";
import {
    Star
} from "lucide-react";


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterVisitButton({place, user}: {place: Place, user: ProfileBasics | null}) {
    const [onWishlist, setOnWishlist] = useState(Boolean);
    GetOnWishlist().then(val => setOnWishlist(val))

    async function GetOnWishlist(): Promise<boolean> {
        try{
            if (user === null) {
                return false;
            }

            const response = await fetch(`${apiUrl}/wishlist/check`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    UserId: user.id,
                    PlaceId: place.id 
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
        } catch (error:any) {
            console.log(error)
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
                    UserId: user.id
                }),
                headers: {
                    "Content-Type": "application/json",
                },
                });

                if (response.ok) {
                    setOnWishlist(true);
                }

                if (!response.ok) {
                throw new Error(`Ett fel uppstod`);
                }
                
            } catch (error: any) {
                console.log(error);
            }
        } else if (onWishlist == true && user != null) {
            try {
                const response = await fetch(`${apiUrl}/wishlist/remove`, {
                method: "DELETE",
                credentials: "include",
                body: JSON.stringify({
                    PlaceId: place.id, 
                    UserId: user.id
                }),
                headers: {
                    "Content-Type": "application/json",
                },
                });

                if (response.ok) {
                    setOnWishlist(false);
                }

                if (!response.ok) {
                throw new Error(`Ett fel uppstod`);
                }
                
            } catch (error: any) {
                console.log(error);
            }
        }
    }
    
    return <>
    {
        user === null ? (
            <></>
        ) : (
            
        <Button onClick={HandleClick}>
            Wishlist {onWishlist == false ? (<><Star/></>) : (<><Star fill="white"/></>)} 
        </Button>
    )}
    </>
}
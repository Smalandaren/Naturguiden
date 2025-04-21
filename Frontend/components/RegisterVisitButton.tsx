import { useState } from "react";
import { Button } from "./ui/button";
import { Place } from "@/types/Place";
import { ProfileBasics } from "@/types/ProfileBasics";
import { Island_Moments } from "next/font/google";
import { get } from "http";
import { error } from "console";
import { resolve } from "path";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterVisitButton({place, user}: {place: Place, user: ProfileBasics | null}) {
    const [isVisited, setIsVisited] = useState(getIsVisited());

    async function getIsVisited(): Promise<Boolean | null> {
        try{
            if (user === null) {
                return false;
            }

            const response = await fetch(`${apiUrl}/visits/check-visit`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    UserId: user?.id,
                    PlaceId: place.id 
                }),
                headers: {
                    "Content-Type": "application/json",
                },
                });
    
                console.log(response.text.toString());
    
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
        if (isVisited == Promise.resolve(false)) {            
            try {
                const response = await fetch(`${apiUrl}/visits`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    UserId: user?.id,
                    PlaceId: place.id 
                }),
                headers: {
                    "Content-Type": "application/json",
                },
                });

                if (response.ok) {
                    setIsVisited(Promise.resolve(true));
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
            Besökt {isVisited == Promise.resolve(false) ? (<></>) : (<>✓</>)}
        </Button>
    )}
    </>
}


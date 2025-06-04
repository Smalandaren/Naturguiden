import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Place } from "@/types/Place";
import { ProfileBasics } from "@/types/ProfileBasics";
import { Island_Moments } from "next/font/google";
import { get } from "http";
import { error } from "console";
import { resolve } from "path";
import { pl } from "date-fns/locale";
import {
    Circle,
    CircleCheckBig
} from "lucide-react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterVisitButton({place, user, text}: {place: Place, user: ProfileBasics | null, text:boolean}) {
    const [isVisited, setIsVisited] = useState(Boolean);

    useEffect(() => {
     getIsVisited().then(val => setIsVisited(val))
    },[])

    async function getIsVisited(): Promise<boolean> {
        try{
            if (user === null) {
                return false;
            }

            const response = await fetch(`${apiUrl}/visits/check-visit`, {
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
        if (isVisited == false && user != null) {            
            try {
                const response = await fetch(`${apiUrl}/visits`, {
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
                    setIsVisited(true);
                }

                if (!response.ok) {
                throw new Error(`Ett fel uppstod`);
                }
                
            } catch (error: any) {
                console.log(error);
            }
        } else if (isVisited == true && user != null) {
            try {
                const response = await fetch(`${apiUrl}/visits`, {
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
                    setIsVisited(false);
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
            
        <Button onClick={event => {
            event.preventDefault();
            HandleClick();
            }}>
            {text == true ? (<>Besökt</>) : (<></>)} {isVisited == false ? (<><Circle/></>) : (<><CircleCheckBig/></>)} 
        </Button>
    )}
    </>
}


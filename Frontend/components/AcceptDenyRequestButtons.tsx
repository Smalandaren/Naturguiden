import { Button } from "@/components/ui/button";
import {
    CircleCheck,
    CircleX
  } from "lucide-react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function AcceptDenyButtons({friendId}: {friendId: number}) {

        async function AcceptRequest() {
        try {
            const response = await fetch(`${apiUrl}/friends/accept-request`, {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify({
                UserId : friendId
            }),
            headers: {
                "Content-Type": "application/json",
            },
            });

            window.location.reload();

            if (!response.ok) {
            throw new Error(`Ett fel uppstod`);
            }
            
        } catch (error: any) {
            console.log(error);
        }
        window.location.reload;
    }
    
    async function DenyRequest() {
        try {
            const response = await fetch(`${apiUrl}/friends/remove`, {
            method: "DELETE",
            credentials: "include",
            body: JSON.stringify({
                UserId : friendId
            }),
            headers: {
                "Content-Type": "application/json",
            },
            });

            window.location.reload();
    
            if (!response.ok) {
            throw new Error(`Ett fel uppstod`);
            }
            
        } catch (error: any) {
            console.log(error);
        }
    }

    return <>
        <Button onClick={() => AcceptRequest()}><CircleCheck /></Button>
        <Button className="bg-red-600 hover:bg-red-500" onClick={() => DenyRequest()}><CircleX /></Button>
    </>
}
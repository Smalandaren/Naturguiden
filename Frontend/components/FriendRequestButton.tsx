"use client";
import { promises } from "dns";
import { Button } from "./ui/button";
import { useState } from "react";
import AcceptDenyButtons from "./AcceptDenyRequestButtons";
import { ProfileBasics } from "@/types/ProfileBasics";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function FriendRequestButton({friendId, self}: {friendId: number, self:ProfileBasics | null}) {
    const [isFriend, setIsFriend] = useState(Boolean);
    GetIsFriend().then(val => setIsFriend(val))

    const [requester, setRequester] = useState(Number);
    GetRequester().then(val => setRequester(val))

    async function GetIsFriend(): Promise<boolean> {
        try{
            if (self == null) {
                return false;
            }

            const response = await fetch(`${apiUrl}/friends/check-friends`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    UserID : friendId
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

    async function GetRequester(): Promise<number> {
        try{
            if (self == null) {
                return -1;
            }

            const response = await fetch(`${apiUrl}/friends/check-request`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    UserID : friendId
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
            return -1;
        }
    }

    async function HandleClick() {
        try{
            if (self == null) {
                return false;
            }

            const response = await fetch(`${apiUrl}/friends/send-request`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    UserId: friendId,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
                });
        
                if (!response.ok) {
                    throw new Error(`Ett fel uppstod`);
                }

                if (response.ok) {
                    setIsFriend(true);
                }
        } catch (error:any) {
            console.log(error)
            return false;
        }
    }

    if (self == null || isFriend || friendId == self.id) {
        return <></>
    }

    if (requester > 0) {
        if (requester == friendId) {
            return <>
            <div className="flex flex-col items-center">
                Acceptera vänförfrågan?
                <div className="flex gap-3">
                    <AcceptDenyButtons friendId={friendId}/>
                </div>
            </div>
            </>
        } else {
            return <><Button disabled={true}>Vänförfrågan skickad!</Button></>
        }
    }
        
    return <>
        <Button onClick={HandleClick}>
            Skicka vänförfrågan
        </Button>
    </>
}
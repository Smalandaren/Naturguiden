"use client";
import { promises } from "dns";
import { Button } from "./ui/button";
import { useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function FriendRequestButton({userId, isLoggedIn}: {userId: number, isLoggedIn: boolean}) {
    const [isFriend, setIsFriend] = useState(Boolean);
    GetIsFriend().then(val => setIsFriend(val))

    async function GetIsFriend(): Promise<boolean> {
        try{
            if (!isLoggedIn) {
                return false;
            }

            const response = await fetch(`${apiUrl}/friends/check-friends`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    UserID : userId
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
        try{
            if (!isLoggedIn) {
                return false;
            }

            const response = await fetch(`${apiUrl}/friends/send-request`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    UserId: userId,
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

        return <>
    {
        !isLoggedIn || isFriend ? (
            <></>
        ) : (
        <Button onClick={HandleClick}>
            Skicka vänförfrågan
        </Button>
    )}
    </>
}
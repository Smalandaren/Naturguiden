"use client";
import { Friend } from "@/types/Friend";
import { useEffect, useState } from "react";
import { ErrorScreen } from "@/components/ErrorScreen";
import { FriendCard, FriendReqCard } from "./FriendCard";
import { Separator } from "@/components/ui/separator";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function FriendsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [friends, setFriends] = useState<Friend[]>();
    const [friendRequests, setFriendRequests] = useState<Friend[]>();

    async function returnFriends(): Promise<Friend[] | null> {
        try {
            const response = await fetch(`${apiUrl}/friends`, {
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

    async function getFriends() {
        setIsLoading(true);
        const friendsTemp = await returnFriends();

        if (friendsTemp) {
            setFriends(friendsTemp)
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getFriends();
      }, []);

    async function returnFriendRequests(): Promise<Friend[] | null> {
        try {
            const response = await fetch(`${apiUrl}/friends/get-requests`, {
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

    async function getFriendRequests() {
        setIsLoading(true);
        const requests = await returnFriendRequests();

        if (requests) {
            setFriendRequests(requests)
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getFriendRequests();
      }, []);
      
      if (isLoading) {
        return <p>loading</p>;
      }

      if (friends == null || friendRequests == null) {
        return (
          <ErrorScreen
            title="Vänner kunde inte visas"
            subtitle="Försök igen senare"
          />
        );
      }

      if ((friends != null && friends.length < 1) && (friendRequests != null && friendRequests.length < 1)) {
        return (
          <ErrorScreen
            title="Inga vänner"
            subtitle="Du har inga vänner än"
            showIcon={false}
          />
        );
      }

      return (
        <div className="mx-6 pt-16">

        {friendRequests.length > 0 ? (
            <>
            <h1 className="text-3xl font-bold mb-4">Vänförfrågningar</h1>
            <Separator />
            <div className="flex flex-col gap-6 mt-4 max-w-2xl">
            {friendRequests.map((friend) => {
              return <FriendReqCard key={friend.id} friend={friend} />;
            })}
            </div>
            <br />
            </>) : (<></>)}
        
        {friends.length > 0 ? (
          <>
          <h1 className="text-3xl font-bold mb-4">Mina vänner</h1>
          <Separator />
          <div className="flex flex-col gap-6 mt-4 max-w-2xl">
            {friends.map((friend) => {
              return <FriendCard key={friend.id} friend={friend} />;
            })}
          </div></>) : (<></>)}
        </div>
      );
}
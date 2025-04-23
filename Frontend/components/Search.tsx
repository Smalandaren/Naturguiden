import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Place } from "@/types/Place";
import { Redirect } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;



export default function Search(){
    function search(formData: { get: (arg0: string) => any; }){
        var query = formData.get("query")
        getSearched(query);
    }
    return(
        <>
            <form action={search}>
                <div className="flex justify-center gap-1">
                <Input name="query" type="text"></Input>
                <Button type="submit">Search</Button>
                </div>
            </form>
        </>
    )
}

async function getSearched(query: string): Promise<Place[] | null> {
    try{
        console.log(query);
        const response = await fetch(`${apiUrl}/search`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                searchTerm: query
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
        return null;
    }
}
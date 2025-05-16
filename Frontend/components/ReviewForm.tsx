import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Place } from "@/types/Place";
import { Rating, Star } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css'
import { useState } from "react";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const myStyles = {
    itemShapes: Star,
    activeFillColor: 'green',
    inactiveFillColor: 'grey'
  }

export default function ReviewForm({place}: {place: Place}){
    const [rating, setRating] = useState(4)
    return <form onSubmit={handleSubmit}>
        <div className="flex flex-row justify-center gap-1">
            <Rating onChange={setRating} value={rating} isRequired={true} highlightOnlySelected={false} itemStyles={myStyles} className="max-w-40"></Rating>
            <Input id="comment" type="text" placeholder="Kommentar" maxLength={200}></Input>
            <Button type="submit">Skapa recension</Button>
        </div>
    </form>


    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>){
        event.preventDefault();
        const form = event.currentTarget
        const formElements = form.elements as typeof form.elements & {
        comment:{value: string}
        }
        await sendReview({comment: formElements.comment.value});
        window.location.reload();
    }

    async function sendReview({comment}: {comment: string}){
        try{
            const response = await fetch(`${apiUrl}/review/create`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    placeId: place.id,
                    rating: rating,
                    comment: comment
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        
        if (!response.ok) {
            throw new Error(`Ett fel uppstod`);
        }
                
    } catch (error:any) {
        console.log(error)
        return null;
    }
  }
}
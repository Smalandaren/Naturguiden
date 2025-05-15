import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Place } from "@/types/Place";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ReviewForm({place}: {place: Place}){
    return <form onSubmit={handleSubmit}>
        <div className="flex justify-center gap-1">
            <Input id="rating" type="number" max={5} min={1} required={true} placeholder="☆" className="w-20"></Input>
            <Input id="comment" type="text" placeholder="Kommentar"></Input>
            <Button type="submit">Skapa recension</Button>
        </div>
    </form>


    function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>){
        event.preventDefault();
        const form = event.currentTarget
        const formElements = form.elements as typeof form.elements & {
        rating: {value: string},
        comment:{value: string}
        }
        sendReview({rating: formElements.rating.value, comment: formElements.comment.value});
    }

    async function sendReview({rating, comment}: {rating: string, comment: string}){
        try{
            const response = await fetch(`${apiUrl}/review/create`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    placeId: place.id,
                    rating: parseInt(rating),
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
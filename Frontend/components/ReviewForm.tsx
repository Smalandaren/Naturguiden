import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Place } from "@/types/Place";
import { ProfileBasics } from "@/types/ProfileBasics";
import { Review } from "@/types/Review";
import { Rating, Star } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { useState } from "react";
import { toast } from "sonner";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const myStyles = {
  itemShapes: Star,
  activeFillColor: "green",
  inactiveFillColor: "grey",
};

export default function ReviewForm({
  place,
  onSuccess,
}: {
  place: Place;
  onSuccess?: (review: Review) => void;
}) {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  return (
    <div className="flex flex-row justify-center gap-1">
      <Rating
        onChange={setRating}
        value={rating}
        isRequired={true}
        highlightOnlySelected={false}
        itemStyles={myStyles}
        className="max-w-40"
      ></Rating>
      <Input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        id="comment"
        type="text"
        placeholder="Kommentar"
        maxLength={200}
      ></Input>
      <Button onClick={handleSubmit}>Skapa recension</Button>
    </div>
  );

  async function handleSubmit() {
    sendReview(comment);
    /* event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      comment: { value: string };
    };
    await sendReview({ comment: formElements.comment.value });
    window.location.reload(); */
  }

  async function sendReview(comment: string) {
    try {
      const response = await fetch(`${apiUrl}/review/create`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          placeId: place.id,
          rating: rating,
          comment: comment,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const createdReview: Review = await response.json();
        if (onSuccess) {
          onSuccess(createdReview);
        }
      }

      if (!response.ok) {
        throw new Error(`Ett fel uppstod`);
      }
    } catch (error: any) {
      toast.error("Din recension kunde inte publiceras");
      console.log(error);
      return null;
    }
  }
}

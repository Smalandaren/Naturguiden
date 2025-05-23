import { ForeignProfile } from "./ForeignProfile";

export interface Review {
  id?: number | null;
  userId?: number | null;
  foreignProfile?: ForeignProfile | null;
  placeId: number;
  rating: number;
  comment?: string | null;
  createdTimestamp?: string | null;
  userName?: string | null;
}

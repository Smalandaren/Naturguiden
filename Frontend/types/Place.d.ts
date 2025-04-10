import { PlaceUtility } from "./PlaceUtility";

export interface Place {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  placeUtilities: PlaceUtility[];
  createdAt: Date;
}

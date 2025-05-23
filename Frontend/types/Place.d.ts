import { PlaceAttribute } from "./PlaceAttribute";

export interface Place {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  placeUtilities: PlaceAttribute[];
  placeCategories: PlaceAttribute[];
  createdAt: Date;
}

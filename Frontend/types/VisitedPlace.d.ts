import { PlaceAttribute } from "./PlaceAttribute";

export interface VisitedPlace {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  placeUtilities: PlaceAttribute[];
  placeCategories: PlaceAttribute[]; 
  visitedAt: Date;
  createdAt: Date;
}

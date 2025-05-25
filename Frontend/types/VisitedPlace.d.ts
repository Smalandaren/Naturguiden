import { PlaceUtility } from "./PlaceUtility";

export interface VisitedPlace {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  placeUtilities: PlaceUtility[];
  visitedAt: Date;
  createdAt: Date;
  placeCategories: PlaceCategory[];
  images?: string[];
}

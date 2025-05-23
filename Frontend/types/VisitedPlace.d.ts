import { PlaceUtility } from "./PlaceUtility";
import { PlaceCategory } from "./PlaceCategory";

export interface VisitedPlace {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  placeUtilities: PlaceUtility[];
  placeCategories: PlaceCategory[];
  images?: string[];
  visitedAt: Date;
  createdAt: Date;
}

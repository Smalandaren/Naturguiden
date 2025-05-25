import { PlaceCategory } from "./PlaceCategory";
import { PlaceUtility } from "./PlaceUtility";

export interface Place {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  placeUtilities: PlaceUtility[];
  placeCategories: PlaceCategory[];
  createdAt: Date;
  images?: string[];
}

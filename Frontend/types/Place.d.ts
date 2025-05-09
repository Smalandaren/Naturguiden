import { PlaceUtility } from "./PlaceUtility";

export interface Place {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string;
  approved: boolean;
  createdBy?: number;
  createdAt: Date;
  placeUtilities: PlaceUtility[];

  categories?: { name: string; description?: string }[];
  attributes?: { name: string; description?: string }[];
  imageUrls: string[];
}

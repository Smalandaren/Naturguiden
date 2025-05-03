import { AnnouncementBanner } from "@/types/AnnouncementBanner";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getAnnouncementBanner(): Promise<AnnouncementBanner | null> {
  try {
    const response = await fetch(`${apiUrl}/announcement`, {
      cache: "no-cache",
      method: "GET",
    });

    const json = (await response.json()) as AnnouncementBanner;

    return json;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
}

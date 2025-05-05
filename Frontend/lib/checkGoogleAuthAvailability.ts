const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function checkGoogleAuthAvailability(): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/GoogleAuth/available`, {
      cache: "no-cache",
      method: "GET",
    });

    const json = (await response.json()) as boolean;

    return json;
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
}

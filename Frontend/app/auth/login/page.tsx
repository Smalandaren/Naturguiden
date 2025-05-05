import { checkAuth } from "@/lib/checkAuth";
import ClientPage from "./ClientPage";
import { redirect } from "next/navigation";
import { checkGoogleAuthAvailability } from "@/lib/checkGoogleAuthAvailability";

export default async function AuthPage() {
  let isAuthenticated = false;
  let googleAuthAvailable = false;

  try {
    const authCheck = await checkAuth();
    const googleAuthCheck = await checkGoogleAuthAvailability();

    if (authCheck.authenticated) {
      isAuthenticated = true;
    }

    googleAuthAvailable = googleAuthCheck;
  } catch (error: any) {
    console.error("Error during authentication check:", error.message);
  }

  if (isAuthenticated) {
    redirect(`/`);
  } else {
    return <ClientPage googleAuthAvailable={googleAuthAvailable} />;
  }
}

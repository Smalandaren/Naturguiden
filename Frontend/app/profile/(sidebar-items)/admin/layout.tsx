import "@/app/globals.css";
import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/checkAuth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let isAuthenticated = false;
  let isAdmin = false;

  try {
    const authCheck = await checkAuth();

    if (authCheck.authenticated) {
      isAuthenticated = true;
    }

    if (authCheck.isAdmin) {
      isAdmin = true;
    }
  } catch (error: any) {
    console.error("Error during authentication check:", error.message);
  }

  if (isAuthenticated && isAdmin) {
    return children;
  } else {
    redirect(`/profile`);
  }
}

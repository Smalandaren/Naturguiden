import "@/app/globals.css";
import { redirect } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ProfileSidebar } from "./ProfileSidebar";
import { checkAuth } from "@/lib/checkAuth";

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let isAuthenticated = false;

  try {
    const authCheck = await checkAuth();

    if (authCheck.authenticated) {
      isAuthenticated = true;
    }
  } catch (error: any) {
    console.error("Error during authentication check:", error.message);
  }

  if (isAuthenticated) {
    return (
      <>
        <SidebarProvider>
          <ProfileSidebar />
          <SidebarInset>
            <div className="absolute m-4">
              <SidebarTrigger />
            </div>

            {children}
          </SidebarInset>
        </SidebarProvider>
      </>
    );
  } else {
    redirect(`/`);
  }
}

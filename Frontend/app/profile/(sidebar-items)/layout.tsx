import "@/app/globals.css";
import { redirect } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { checkAuth } from "@/lib/checkAuth";
import { ProfileSidebar } from "../ProfileSidebar";

export default async function ProfileLayout({
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

  if (isAuthenticated) {
    return (
      <>
        <SidebarProvider>
          <ProfileSidebar showAdminItems={isAdmin} />
          <SidebarInset>
            <div className="absolute m-4 block md:hidden">
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

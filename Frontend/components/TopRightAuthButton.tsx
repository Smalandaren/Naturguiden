"use client";
import { LogIn, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function TopRightAuthButton({
  authenticated,
}: {
  authenticated: boolean;
}) {
  const router = useRouter();

  async function handleLogOut() {
    try {
      const response = await fetch(`${apiUrl}/auth/log-out`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Fetch error: ${response.statusText}`);
      }
      router.refresh();
    } catch (error: any) {
      console.log(error);
      alert("Error: " + error.message);
    }
  }

  if (authenticated) {
    return (
      <Button variant="outline" onClick={handleLogOut}>
        <LogOut />
        Logga ut
      </Button>
    );
  } else {
    return (
      <Link href="/auth/login">
        <Button>
          <LogIn />
          Logga in
        </Button>
      </Link>
    );
  }
}

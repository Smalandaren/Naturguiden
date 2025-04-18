"use client";
import { LogIn, LogOut, UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProfileBasics } from "@/types/ProfileBasics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function TopRightAuthButton({
  authenticated,
  user,
}: {
  authenticated: boolean;
  user: ProfileBasics | null;
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

  function InitialsAvatar({ user }: { user: ProfileBasics | null }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-primary" size="icon">
            <UserCircle />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            {user?.firstName} {user?.lastName}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/profile">
            <DropdownMenuItem>Min profil</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogOut}>
            <LogOut />
            <span>Logga ut</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (authenticated) {
    return <InitialsAvatar user={user} />;
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

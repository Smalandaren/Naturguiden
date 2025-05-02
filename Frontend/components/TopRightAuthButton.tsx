"use client";
import { Crown, LogIn, LogOut, UserCircle } from "lucide-react";
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
  isAdmin,
}: {
  authenticated: boolean;
  user: ProfileBasics | null;
  isAdmin?: boolean;
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
          <div className="flex flex-row items-center">
            <DropdownMenuLabel>
              {user?.firstName} {user?.lastName}
            </DropdownMenuLabel>
            {isAdmin ? <Crown size={20} color="green" /> : null}
          </div>
          <DropdownMenuSeparator />
          <Link href="/profile">
            <DropdownMenuItem>Min profil</DropdownMenuItem>
          </Link>
          {isAdmin ? (
            <Link href="/profile/admin">
              <DropdownMenuItem>Administration</DropdownMenuItem>
            </Link>
          ) : null}
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

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import validator from "email-validator";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ClientPage({
  googleAuthAvailable,
}: {
  googleAuthAvailable: boolean;
}) {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/auth/log-in`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 401) {
        throw new Error("Felaktig e-post eller lösenord");
      }
      if (response.status == 400) {
        throw new Error("Ogiltigt format på förfrågan");
      }
      if (response.ok) {
        toast.success("Inloggning lyckades");
        router.replace("/");
        router.refresh();
      } else {
        throw new Error("Ett fel uppstod");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
    setIsLoading(false);
  }

  function handleKeyDown(event: any) {
    if (event.key === "Enter" && emailInput && passwordInput) {
      handleLogin();
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="w-[90%] md:w-[50%] 2xl:w-[25%]">
        <div className="flex flex-col items-center gap-4">
          <h1 className="font-bold tracking-tight text-3xl sm:text-4xl">
            Inloggning
          </h1>
          <Input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Email"
          />
          <Input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Password"
          />
          <Button
            disabled={
              !validator.validate(emailInput) ||
              emailInput.length < 1 ||
              passwordInput.length < 1 ||
              isLoading
            }
            onClick={handleLogin}
            className="w-full"
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin h-5 w-5" />
            ) : (
              "Logga in"
            )}
          </Button>
          {!googleAuthAvailable ? (
            <Button disabled={!googleAuthAvailable} className="w-full">
              Logga in med Google
            </Button>
          ) : (
            <Link
              className="w-full"
              href={`${apiUrl}/GoogleAuth/log-in`}
            >
              <Button disabled={!googleAuthAvailable} className="w-full">
                Logga in med Google
              </Button>
            </Link>
          )}
          <p className="text-muted-foreground">eller</p>
          <Link className="w-full" href="/auth/register">
            <Button className="w-full" variant="outline">
              Skapa konto
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

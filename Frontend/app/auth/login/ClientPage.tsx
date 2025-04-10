"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ClientPage() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState("demo");
  const [passwordInput, setPasswordInput] = useState("demo");
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
      if (!response.ok) {
        throw new Error(`Fetch error: ${response.statusText}`);
      }
      router.replace("/");
      router.refresh();
    } catch (error: any) {
      console.log(error);
      alert("Error: " + error.message);
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
            Authentication
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
              emailInput.length < 1 || passwordInput.length < 1 || isLoading
            }
            onClick={handleLogin}
            className="w-full"
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin h-5 w-5" />
            ) : (
              "Log in"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

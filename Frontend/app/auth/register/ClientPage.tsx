"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput,
          firstName: firstNameInput,
          lastName: lastNameInput,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 409) {
        throw new Error("E-postadressen är redan kopplad till ett konto");
      }
      if (!response.ok) {
        throw new Error(`Ett fel uppstod`);
      }
      router.replace("/");
      router.refresh();
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(event: any) {
    if (
      event.key === "Enter" &&
      emailInput &&
      passwordInput &&
      firstNameInput &&
      lastNameInput
    ) {
      handleRegister();
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="w-[90%] md:w-[50%] 2xl:w-[25%]">
        <div className="flex flex-col items-center gap-4">
          <h1 className="font-bold tracking-tight text-3xl sm:text-4xl">
            Skapa konto
          </h1>

          <div className="flex flex-col gap-2 w-full">
            <Label>E-post</Label>
            <Input
              type="email"
              autoComplete="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label>Lösenord</Label>
            <Input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label>Förnamn</Label>
            <Input
              type="text"
              autoComplete="given-name"
              value={firstNameInput}
              onChange={(e) => setFirstNameInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label>Efternamn</Label>
            <Input
              type="text"
              autoComplete="family-name"
              value={lastNameInput}
              onChange={(e) => setLastNameInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <Button
            disabled={
              !emailInput ||
              !passwordInput ||
              !firstNameInput ||
              !lastNameInput ||
              isLoading
            }
            onClick={handleRegister}
            className="w-full"
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin h-5 w-5" />
            ) : (
              "Skapa konto"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

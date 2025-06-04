import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function DeleteAccountDialog() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);

  function getCurrentStepContent() {
    switch (activeStep) {
      case 1:
        return <Step1 onContinue={() => setActiveStep(2)} />;
      case 2:
        return (
          <Step2 onCancel={() => setActiveStep(1)} onDelete={deleteAccount} />
        );
      default:
        return null;
    }
  }

  async function deleteAccount(): Promise<void> {
    try {
      const response = await fetch(`${apiUrl}/profile/delete`, {
        cache: "no-cache",
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast.error("Ditt konto kunde inte raderas");
      } else {
        toast.success("Ditt konto har raderats");
        router.replace("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("Ditt konto kunde inte raderas");
      console.log(error);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full bg-red-800 hover:bg-red-700">
          Radera konto
        </Button>
      </AlertDialogTrigger>
      {getCurrentStepContent()}
    </AlertDialog>
  );
}

function Step1({ onContinue }: { onContinue: () => void }) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Är du helt säker?</AlertDialogTitle>
        <AlertDialogDescription>
          Den här åtgärden kan inte ångras. Det här kommer permanent att radera
          ditt konto och ta bort alla dina uppgifter från vårt system.
          {/* <br />
          <br />
          Uppgifter som kommer raderas:
          <ul className="list-disc list-inside marker:text-red-800 mt-2">
            <li>Profil</li>
            <li>Besökta platser</li>
            <li>Wishlist</li>
            <li>Recensioner</li>
            <li>Vänskapsrelationer</li>
          </ul> */}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Avbryt</AlertDialogCancel>
        <Button onClick={onContinue} className="bg-red-800 hover:bg-red-700">
          Fortsätt
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

function Step2({
  onCancel,
  onDelete,
}: {
  onCancel: () => void;
  onDelete: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsDisabled(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Sista chansen!</AlertDialogTitle>
        <AlertDialogDescription>
          Innan ditt konto raderas permanent ber vi dig tänka igenom beslutet.
          Ditt konto kan inte återställas efter radering.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>Avbryt</AlertDialogCancel>
        <AlertDialogAction
          onClick={onDelete}
          disabled={isDisabled}
          className={`bg-red-800 hover:bg-red-700  ${
            isDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isDisabled
            ? `Radera mitt konto (${secondsLeft})`
            : "Radera mitt konto"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

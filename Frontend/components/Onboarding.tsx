"use client";

import { useEffect, useState } from "react";
import { ArrowRightIcon, TreePine } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const showOnboarding = localStorage.getItem("show_onboarding");
    if (showOnboarding === null) {
      setOpen(true);
      localStorage.setItem("show_onboarding", "false");
    }
  }, []);

  const stepContent = [
    {
      title: "Välkommen till Naturguiden!",
      description: "En tjänst som låter dig utforska naturplatser i Skåne",
    },
    {
      title: "Bli en del av NaturGuiden",
      description:
        "Som medlem kan du bland anant föreslå nya platser, skriva recensioner eller till och med följa dina vänners besök!",
    },
  ];

  const totalSteps = stepContent.length;

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (open) setStep(1);
      }}
    >
      <DialogContent className="gap-0 p-0 [&>button:last-child]:text-white">
        <div className="w-full h-48 flex items-center justify-center bg-primary/20">
          <TreePine size={80} color="green" />
        </div>
        <div className="space-y-6 px-6 pt-3 pb-6">
          <DialogHeader>
            <DialogTitle>{stepContent[step - 1].title}</DialogTitle>
            <DialogDescription>
              {stepContent[step - 1].description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex justify-center space-x-1.5 max-sm:order-1">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "bg-primary size-1.5 rounded-full",
                    index + 1 === step ? "bg-primary" : "opacity-20"
                  )}
                />
              ))}
            </div>
            <DialogFooter>
              <DialogClose onClick={() => setOpen(false)} asChild>
                <Button type="button" variant="ghost">
                  Skippa
                </Button>
              </DialogClose>
              {step < totalSteps ? (
                <Button
                  className="group"
                  type="button"
                  onClick={handleContinue}
                >
                  Fortsätt
                  <ArrowRightIcon
                    className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    aria-hidden="true"
                  />
                </Button>
              ) : (
                <DialogClose asChild>
                  <Link href="/auth/register">
                    <Button onClick={() => setOpen(false)} type="button">
                      Skapa konto
                    </Button>
                  </Link>
                </DialogClose>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

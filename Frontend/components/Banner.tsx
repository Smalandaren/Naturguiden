"use client";

import { useState } from "react";
import { CircleAlert, Info, RocketIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnnouncementBanner } from "@/types/AnnouncementBanner";
import Link from "next/link";

// Hämtad från https://originui.com/banner och därefter moddad

export default function Banner({ data }: { data: AnnouncementBanner }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-muted text-foreground px-4 py-3">
      <div className="flex gap-2 md:items-center">
        <div className="flex grow gap-3 md:items-center">
          {returnIcon(data.type)}
          <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{data.title}</p>
              <p className="text-muted-foreground text-sm">{data.subtitle}</p>
            </div>
            <div className="flex gap-2 max-md:flex-wrap">
              {data.showButton ? (
                <Link href={`${data.buttonLink}`}>
                  <Button>{data.buttonText}</Button>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function returnIcon(type: string) {
  switch (type) {
    case "information":
      return <InformationIcon />;

    case "danger":
      return <DangerIcon />;

    default:
      return <InformationIcon />;
  }
}

function InformationIcon() {
  return (
    <div
      className="bg-primary/40 flex size-9 shrink-0 items-center justify-center rounded-full max-md:mt-0.5"
      aria-hidden="true"
    >
      <Info className="opacity-80" size={20} />
    </div>
  );
}

function DangerIcon() {
  return (
    <div
      className="bg-red-500/40 flex size-9 shrink-0 items-center justify-center rounded-full max-md:mt-0.5"
      aria-hidden="true"
    >
      <CircleAlert className="opacity-80" size={20} />
    </div>
  );
}

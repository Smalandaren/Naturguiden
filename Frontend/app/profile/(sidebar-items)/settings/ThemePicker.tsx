"use client";

import { useEffect, useId, useState } from "react";
import { CheckIcon, MinusIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { useTheme } from "next-themes";

// grunden till denna komponent är plockad från https://originui.com/radio

const items = [
  { value: "light", label: "Ljust", image: "ui-light.png" },
  { value: "dark", label: "Mörkt", image: "ui-dark-green.png" },
  { value: "system", label: "System", image: "ui-system-green.png" },
];

export default function ThemePicker() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const id = useId();

  // detta förhindrar "hydration error" enl https://www.npmjs.com/package/next-themes
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <fieldset className="space-y-4">
      <legend className="text-foreground text-lg leading-none font-medium">
        Välj ett tema
      </legend>
      <RadioGroup
        className="flex gap-3"
        value={theme}
        onValueChange={(value) => setTheme(value)}
      >
        {items.map((item) => (
          <label key={`${id}-${item.value}`}>
            <RadioGroupItem
              id={`${id}-${item.value}`}
              value={item.value}
              className="peer sr-only after:absolute after:inset-0"
            />
            <Image
              src={`/theme-images/${item.image}`}
              alt={item.label}
              width={88}
              height={70}
              className="border-input peer-focus-visible:ring-ring/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent relative cursor-pointer overflow-hidden rounded-md border border-2 shadow-xs transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px] peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50"
            />
            <span className="group peer-data-[state=unchecked]:text-muted-foreground/70 mt-2 flex items-center gap-1">
              <CheckIcon
                size={16}
                className="group-peer-data-[state=unchecked]:hidden"
                aria-hidden="true"
              />
              <MinusIcon
                size={16}
                className="group-peer-data-[state=checked]:hidden"
                aria-hidden="true"
              />
              <span className="text-xs font-medium">{item.label}</span>
            </span>
          </label>
        ))}
      </RadioGroup>
    </fieldset>
  );
}

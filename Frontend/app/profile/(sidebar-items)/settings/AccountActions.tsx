"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeleteAccountDialog } from "./DeleteAccountDialog";

export default function AccountActions({
  allowPasswordChange,
}: {
  allowPasswordChange: boolean;
}) {
  return (
    <fieldset className="space-y-4 max-w-3xs">
      <legend className="text-foreground text-lg leading-none font-medium">
        Kontoåtgärder
      </legend>
      <div className="flex flex-col gap-4">
        {/* {allowPasswordChange ? (
          <Button className="w-full">Ändra lösenord</Button>
        ) : (
          <DisabledPasswordChangeButton />
        )} */}

        <DeleteAccountDialog />
      </div>
    </fieldset>
  );
}

function DisabledPasswordChangeButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0}>
          <Button disabled className="w-full">
            Ändra lösenord
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="p-1">
          Ditt konto är skapat via en tredje part och har därav inget lösenord
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

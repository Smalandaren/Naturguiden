import { PlaceUtility } from "@/types/PlaceUtility";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const utilityDisplayNames: Record<string, string> = {
  bilparkering: "Bilparkering",
  elbilsladdare: "Elbilsladdare",
};

function getDisplayName(name: string): string {
  return utilityDisplayNames[name] ?? name; // Om det inte finns något display name ^ visas det "råa" namnet
}

export default function UtilityBadge({
  placeUtility,
  disableTooltip,
}: {
  placeUtility: PlaceUtility;
  disableTooltip?: boolean;
}) {
  if (disableTooltip) {
    return <Badge variant="default">{getDisplayName(placeUtility.name)}</Badge>;
  } else {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="default">{getDisplayName(placeUtility.name)}</Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{placeUtility.description}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
}

import { PlaceAttribute } from "@/types/PlaceAttribute";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const attributeDisplayNames: Record<string, string> = {

};

function getDisplayName(name: string): string {
  return attributeDisplayNames[name] ?? name; // Om det inte finns något display name ^ visas det "råa" namnet
}

export default function AttributeBadge({
  placeAttribute,
  disableTooltip,
}: {
  placeAttribute: PlaceAttribute;
  disableTooltip?: boolean;
}) {
  if (disableTooltip) {
    return <Badge variant="default">{getDisplayName(placeAttribute.name)}</Badge>;
  } else {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="default">{getDisplayName(placeAttribute.name)}</Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{placeAttribute.description}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
}

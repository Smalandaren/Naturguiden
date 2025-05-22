import { PlaceCategory } from "@/types/PlaceCategory";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const categoryDisplayNames: Record<string, string> = {

};

function getDisplayName(name: string): string {
  return categoryDisplayNames[name] ?? name; // Om det inte finns något display name ^ visas det "råa" namnet
}

export default function CategoryBadge({
  placeCategory,
  disableTooltip,
}: {
  placeCategory: PlaceCategory;
  disableTooltip?: boolean;
}) {
  if (disableTooltip) {
    return <Badge variant="default">{getDisplayName(placeCategory.name)}</Badge>;
  } else {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="default">{getDisplayName(placeCategory.name)}</Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{placeCategory.description}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
}

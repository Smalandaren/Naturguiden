import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FcGoogle } from "react-icons/fc";

export default function ProviderIcon({
  provider,
  size,
  disableTooltip = false,
}: {
  provider: string;
  size: number;
  disableTooltip?: boolean;
}) {
  const iconSize = size;
  switch (provider) {
    case "google":
      return <Google />;
    default:
      break;
  }

  function Google() {
    if (disableTooltip) {
      return <FcGoogle size={iconSize} />;
    }
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <FcGoogle size={iconSize} />
        </TooltipTrigger>
        <TooltipContent>
          <p>Kontot är kopplat till Google</p>
        </TooltipContent>
      </Tooltip>
    );
  }
}

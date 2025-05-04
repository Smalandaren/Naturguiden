import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FcGoogle } from "react-icons/fc";

export default function ProviderIcon({ provider }: { provider: string }) {
  const iconSize = 25;
  switch (provider) {
    case "google":
      return <Google />;
    default:
      break;
  }

  function Google() {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <FcGoogle size={iconSize} />
        </TooltipTrigger>
        <TooltipContent>
          <p>Ditt konto är kopplat till Google</p>
        </TooltipContent>
      </Tooltip>
    );
  }
}

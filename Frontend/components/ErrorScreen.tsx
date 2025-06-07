import { TriangleAlert } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export function ErrorScreen({
  showIcon = true,
  showBackButton = false,
  title,
  subtitle,
}: {
  showIcon?: boolean;
  showBackButton?: boolean;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background p-6">
      <div className="flex flex-col items-center gap-4">
        {showIcon ? <TriangleAlert size={40} color="green" /> : null}
        <h1 className="font-extrabold text-3xl sm:text-4xl">{title}</h1>
        <h1 className="text-lg text-center text-muted-foreground">
          {subtitle}
        </h1>
        {showBackButton ? (
          <Link href="/">
            <Button variant="default">Tillbaka till startsidan</Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

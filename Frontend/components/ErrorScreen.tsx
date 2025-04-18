import { TriangleAlert } from "lucide-react";

export function ErrorScreen({
  showIcon = true,
  title,
  subtitle,
}: {
  showIcon?: boolean;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {showIcon ? <TriangleAlert size={40} color="green" /> : null}
        <h1 className="font-extrabold text-3xl sm:text-4xl">{title}</h1>
        <h1 className="text-lg text-center text-muted-foreground">
          {subtitle}
        </h1>
      </div>
    </div>
  );
}

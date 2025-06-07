import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleChangePassword() {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/change-password`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.status === 401) {
        toast.error("Felaktigt nuvarande lösenord");
        return;
      }
      if (!response.ok) {
        toast.error("Lösenordet kunde inte uppdateras");
      } else {
        toast.success("Ditt lösenord har uppdaterats");
        setOpen(false);
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (error) {
      toast.error("Ett fel inträffade vid uppdatering av lösenordet");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Ändra lösenord</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle>Ändra lösenord</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="current-password">Nuvarande lösenord</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="new-password">Nytt lösenord (Minst 6 tecken)</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Avbryt</Button>
          </DialogClose>
          <Button
            onClick={handleChangePassword}
            disabled={newPassword.length < 6}
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin h-5 w-5" />
            ) : (
              "Spara"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

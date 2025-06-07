import { Separator } from "@/components/ui/separator";
import ThemePicker from "./ThemePicker";
import AccountActions from "./AccountActions";
import { getSessionCookie } from "@/lib/checkAuth";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export type CanChangePasswordResult = "unknown" | true | false;

export default async function SettingsPage() {
  async function CheckIfCanChangePassword(): Promise<boolean | null> {
    const sessionCookie = await getSessionCookie();
    try {
      const response = await fetch(`${apiUrl}/auth/can-change-password`, {
        cache: "no-cache",
        method: "GET",
        headers: {
          Cookie: `${sessionCookie?.name}=${sessionCookie?.value}`,
        },
      });

      const json = await response.json();

      return json.canChangePassword;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  let canChangePassword: CanChangePasswordResult = "unknown";
  try {
    const canChangePasswordCheck = await CheckIfCanChangePassword();

    if (canChangePasswordCheck != null) {
      canChangePassword = canChangePasswordCheck;
    }
  } catch (error: any) {
    console.error("Error during can change password-check:", error.message);
  }

  return (
    <div className="mx-6 pt-16">
      <h1 className="text-3xl font-bold mb-4">Inställningar</h1>
      <Separator />
      <div className="mt-4">
        <ThemePicker />
        <AccountActions
          allowPasswordChange={canChangePassword as CanChangePasswordResult}
        />
      </div>
    </div>
  );
}

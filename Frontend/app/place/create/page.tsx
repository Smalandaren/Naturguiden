import { redirect } from "next/navigation";
import { getSessionCookie, checkAuth } from "@/lib/checkAuth";
import CreatePlaceForm from "./ClientPage";

export default async function CreatePlacePage() {
  const authCheck = await checkAuth();

  if (!authCheck.authenticated) {
    redirect("/");
  }

  return <CreatePlaceForm />;
}
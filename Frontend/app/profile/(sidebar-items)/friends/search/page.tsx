"use client";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Smile } from "lucide-react";
import { useState } from "react";
import { ForeignProfile } from "@/types/ForeignProfile";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { AnimatePresence, motion } from "motion/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import Link from "next/link";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type AlertType = "info" | "no_results";

export default function FriendsSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<ForeignProfile[]>([]);
  const [showAlert, setShowAlert] = useState<boolean>(true);
  const [alertType, setAlertType] = useState<AlertType>("info");

  async function handleSearch() {
    try {
      const response = await fetch(`${apiUrl}/profile/search/${searchQuery}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Sökningen kunde inte genomföras");
      }

      if (response.ok) {
        const profiles = (await response.json()) as ForeignProfile[];
        setProfiles(profiles);
        if (profiles.length > 0) {
          setShowAlert(false);
        } else {
          setShowAlert(true);
          setAlertType("no_results");
        }
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error.message);
    }
  }

  function handleKeyDown(event: any) {
    if (event.key === "Enter" && searchQuery) {
      handleSearch();
    }
  }

  return (
    <div className="flex justify-center items-center p-6">
      <div className="w-full max-w-4xl flex flex-col my-10">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Sök efter vänner
        </h1>

        <div className="mb-8 flex gap-3">
          <Label htmlFor="friend-search" className="sr-only">
            Sök
          </Label>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Demo McDemosson"
            className="h-14 px-4 !text-xl"
          />
          <Button
            disabled={!searchQuery}
            onClick={handleSearch}
            variant="default"
            size="icon"
            className="h-14 w-20"
          >
            <Search className="size-7" />
          </Button>
        </div>

        {showAlert && (
          <motion.div
            key="alert-banner"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertBanner type={alertType} />
          </motion.div>
        )}
        <div className="space-y-5">
          <AnimatePresence>
            {profiles.map((profile) => {
              return (
                <motion.div
                  key={profile.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardContent className="px-4 py-0 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-medium">
                          {profile.firstName} {profile.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Gick med{" "}
                          {format(new Date(profile.createdAt), "d MMMM yyyy", {
                            locale: sv,
                          })}
                        </p>
                      </div>
                      <Link href={`/profile/${profile.id}`}>
                        <Button variant="default">Till profilen</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function AlertBanner({ type }: { type: AlertType }) {
  if (type === "info") {
    return (
      <div className="w-full">
        <Alert className="bg-primary/20 border-primary">
          <AlertTitle className="text-lg">
            Resultatet kommer visas här
          </AlertTitle>
          <AlertDescription className="text-lg text-text">
            Skriv in ett sökord i textrutan ovan och klicka på Sök-knappen
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  if (type === "no_results") {
    return (
      <div className="w-full">
        <Alert className="bg-orange-500/20 border-orange-500">
          <AlertTitle className="text-lg">Inget resultat</AlertTitle>
          <AlertDescription className="text-lg text-text">
            Inga profiler hittades efter sökordet
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}

"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Cog,
  Crown,
  ListCheck,
  Settings,
  TreePine,
  UserCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const items = [
  {
    title: "Min profil",
    url: "",
    icon: UserCircle,
  },
  {
    title: "Mina besök",
    url: "visits",
    icon: ListCheck,
  },
  {
    title: "Inställningar",
    url: "settings",
    icon: Cog,
  },
];

const adminItems = [
  {
    title: "Alla profiler",
    url: "admin/profiles",
  },
];

export function ProfileSidebar({
  showAdminItems,
}: {
  showAdminItems: boolean;
}) {
  const pathname = usePathname();
  const basePath = "/profile";

  return (
    <Sidebar variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="mb-8">
                <SidebarMenuButton
                  size="lg"
                  className="[&>svg]:size-5 transition"
                  asChild
                >
                  <Link href="/">
                    <>
                      <ArrowLeft />
                      <span className="text-lg font-semibold">
                        Till startsidan
                      </span>
                    </>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {items.map((item, index) => {
                const fullPath = item.url
                  ? `${basePath}/${item.url}`
                  : basePath;
                const isActive = pathname === fullPath;

                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton
                      isActive={isActive}
                      size="lg"
                      className="[&>svg]:size-5 transition"
                      asChild
                    >
                      <Link href={fullPath}>
                        <>
                          <item.icon />
                          <span className="text-lg font-semibold">
                            {item.title}
                          </span>
                        </>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              {showAdminItems ? <AdminMenuItems /> : null}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function AdminMenuItems() {
  const pathname = usePathname();
  const basePath = "/profile";
  return (
    <Collapsible className="group/collapsible" defaultOpen={true}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="[&>svg]:size-5 transition hover:cursor-pointer"
          >
            <>
              <Crown />
              <span className="text-lg font-semibold">Administration</span>
            </>
            <ChevronRight className="transition-transform ml-auto group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {adminItems.map((item, index) => {
              const fullPath = item.url ? `${basePath}/${item.url}` : basePath;
              const isActive = pathname === fullPath;

              return (
                <SidebarMenuSubItem key={index}>
                  <SidebarMenuSubButton isActive={isActive} asChild>
                    <Link href={fullPath}>
                      <span className="text-md font-semibold">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

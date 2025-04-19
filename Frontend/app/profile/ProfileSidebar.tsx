"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { TreePine, UserCircle } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export const items = [
  {
    title: "Min profil",
    url: "",
    icon: UserCircle,
  },
  {
    title: "Exempel",
    url: "example",
    icon: TreePine,
  },
];

export function ProfileSidebar() {
  const pathname = usePathname();
  const basePath = "/profile";

  return (
    <Sidebar variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const fullPath = item.url
                  ? `${basePath}/${item.url}`
                  : basePath;
                const isActive = pathname === fullPath;

                return (
                  <SidebarMenuItem key={item.title}>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

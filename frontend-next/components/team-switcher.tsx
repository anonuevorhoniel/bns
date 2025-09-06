"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import lagunaLogo from "../public/images/laguna.png";

export function TeamSwitcher({
    team,
}: {
    team: {
        name: string;
        plan: string;
    };
}) {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <Image
                        alt="lagunaLogo"
                        src={lagunaLogo}
                        className="size-8"
                    />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                            {team.name}
                        </span>
                        <span className="truncate text-xs">{team.plan}</span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

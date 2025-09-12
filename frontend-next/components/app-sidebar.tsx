"use client";

import * as React from "react";
import {
    ChartBarIncreasing,
    ChartColumnIncreasing,
    Coins,
    GalleryVerticalEnd,
    GraduationCap,
    History,
    Hourglass,
    Signature,
    SquareTerminal,
    Users2,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@/app/global/user/useUser";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useUser();

    const data = {
        team: {
            name: "BNS",
            plan: "Barangay Nutrition Scholar ",
        },
        navMain: [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: ChartColumnIncreasing,
            },
            {
                title: "Scholars",
                url: "/scholars",
                icon: GraduationCap,
            },
            {
                title: "Payrolls",
                url: "/payrolls",
                icon: Coins,
            },
            {
                title: "Users",
                url: "/users",
                icon: Users2,
            },
            {
                title: "Service Periods",
                url: "/service-periods",
                icon: Hourglass,
            },
            {
                title: "Signatories",
                url: "/signatories",
                icon: Signature,
            },
            {
                title: "Audit Trails",
                url: "/audit-trails",
                icon: History,
            },
        ],
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher team={data.team} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

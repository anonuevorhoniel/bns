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

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    team: {
        name: "BNS",
        plan: "Barangay Nutrition Scholar "
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher team={data.team} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

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
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/user/useUser";
import { Skeleton } from "./ui/skeleton";

export function AppSidebar() {
    const { data, isFetching, status, isSuccess, isLoading } = useUser();
    const user = data?.data;
    const [sidebarItems, setSidebarItems] = React.useState<any>([]);

    const admin = [
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
    ];

    const encoder = [
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
    ];

    React.useEffect(() => {
        if (user?.classification == "Encoder") {
            setSidebarItems(encoder);
        } else {
            setSidebarItems(admin);
        }
    }, [user?.classification]);

    const org = {
        name: "BNS",
        plan: "Barangay Nutrition Scholar",
    };
    if (isLoading) {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <TeamSwitcher team={org} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="space-y-3">
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarMenu>
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-5" />{" "}
                            <Skeleton className="h-5 w-40" />
                        </div>
                    </SidebarMenu>
                    <SidebarMenu>
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-5" />{" "}
                            <Skeleton className="h-5 w-40" />
                        </div>
                    </SidebarMenu>
                    <SidebarMenu>
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-5" />{" "}
                            <Skeleton className="h-5 w-40" />
                        </div>
                    </SidebarMenu>
                    <SidebarMenu>
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-5" />{" "}
                            <Skeleton className="h-5 w-40" />
                        </div>
                    </SidebarMenu>
                    <SidebarMenu>
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-5" />{" "}
                            <Skeleton className="h-5 w-40" />
                        </div>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarGroup>
                    <SidebarMenu>
                       <div className="flex gap-2">
                         <Skeleton className="h-8 w-8 "/>
                         <div className="flex flex-col gap-2">
                            <Skeleton className="h-3 w-50"/>
                             <Skeleton className="h-2 w-30"/>
                         </div>
                       </div>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
    }

    //infinite loop kapag merong isfetching

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <TeamSwitcher team={org} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={sidebarItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

import * as React from "react";
import { CircleDollarSign, GraduationCap, Hourglass, LayoutDashboard, PencilLine, ScanEye, UsersRound } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import logo from "../../public/laguna.png";

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: window.location.pathname == "/dashboard"
                ? true
                : false,
        },
        {
            title: "Scholars",
            url: "/scholars",
            icon: GraduationCap,
            isActive: window.location.pathname == "/scholars"
                ? true
                : false,
        },
        {
            title: "Payrolls",
            url: "/payrolls",
            icon: CircleDollarSign,
            isActive: window.location.pathname == "/payrolls"
                ? true
                : false,
        },
        {
            title: "Users",
            url: "/users",
            icon: UsersRound,
            isActive: window.location.pathname == "/users"
                ? true
                : false,
        },
        {
            title: "Service Periods",
            url: "/service_periods",
            icon: Hourglass,
            isActive: window.location.pathname == "/service-periods"
                ? true
                : false,
        },
        {
            title: "Signatories",
            url: "#",
            icon: PencilLine,
            isActive: window.location.pathname == "/signatories"
                ? true
                : false,
        },
        {
            title: "Audit Trail",
            url: "#",
            icon: ScanEye,
            isActive: window.location.pathname == "/audit-trail"
                ? true
                : false,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="xl"
                            className="flex justify-center"
                            asChild
                        >
                            <a href="#">
                                <img src={logo} className="size-15" alt="" />
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

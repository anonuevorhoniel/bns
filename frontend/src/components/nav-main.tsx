"use client";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";

export function NavMain({ items }: any) {
    const location = useLocation();
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items?.map((item: any) => (
                    <SidebarMenuItem key={item.title}>
                        <NavLink to={item.url} className={"active"}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                isActive={item.url == location.pathname}
                            >
                                {item.icon && <item.icon />}
                                <span className="text-base">{item.title}</span>
                            </SidebarMenuButton>
                        </NavLink>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import Provider from "../providers";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useUser } from "@/hooks/user/useUser";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/custom/loading-screen";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { setTheme } = useTheme();
    const { isLoading } = useUser();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (isLoading || !mounted) {
        return <LoadingScreen />    ;
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center justify-between gap-2 px-4 w-full">
                        <SidebarTrigger className="" />
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                                        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                                        <span className="sr-only">
                                            Toggle theme
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => setTheme("light")}
                                    >
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setTheme("dark")}
                                    >
                                        Dark
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setTheme("system")}
                                    >
                                        System
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 lg:px-8 pt-0">
                    {children}{" "}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

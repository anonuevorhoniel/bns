import { UseAuth } from "@/Actions/AuthAction";
import { UseLayout } from "@/Actions/LayoutAction";
import ax from "@/Axios";
import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import LoginLoadingScreen from "@/LoginLoadingScreen";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useNavigate } from "react-router-dom";
export default function Layout() {
    const { authenticate, user } = UseAuth();
    const { b_subitems, b_item } = UseLayout();

    const nav = useNavigate();

    useQuery({
        queryKey: ["auth"],
        queryFn: () => authenticate(nav),
        refetchOnWindowFocus: false,
    });

    // const {isError, data} = useQuery({
    //     queryKey: ["auth"],
    //     queryFn: () => ax.get("/check-auth"),
    //     refetchOnWindowFocus: false,
    // });
    if (!user) return <LoginLoadingScreen />;

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        {b_item}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {b_subitems && (
                                    <BreadcrumbSeparator className="hidden md:block" />
                                )}
                                {b_subitems && (
                                    <>
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>
                                                {b_subitems}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                )}

                                {/* {b_subitems?.length > 0 &&
                                    b_subitems.map((b_sub) => (
                                        <Fragment key={b_sub}>
                                            <BreadcrumbSeparator className="hidden md:block" />
                                            <BreadcrumbItem>
                                                <BreadcrumbPage>
                                                    {b_sub}
                                                </BreadcrumbPage>
                                            </BreadcrumbItem>
                                        </Fragment>
                                    ))} */}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <Separator />
                <div className="p-5 flex-1">
                    <Outlet />
                </div>
                <footer className="p-4 text-center bg-gray-100 dark:bg-gray-800">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex font-bold">
                            <div className="mr-1">Copyright © 2025</div>
                            <a
                                href="https://laguna.gov.ph"
                                className="text-blue-900 mr-1 underline hover:font-extrabold"
                            >
                                Provincial Government of Laguna
                            </a>
                            Management Information Systems Office. All rights
                            reserved
                        </div>
                    </span>
                </footer>
            </SidebarInset>
        </SidebarProvider>
    );
}

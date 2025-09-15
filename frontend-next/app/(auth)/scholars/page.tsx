"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SearchBar from "@/components/custom/searchbar";
import { Download, Plus } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import DataTable from "@/components/custom/datatable";
import Link from "next/link";
import { useScholarView } from "@/app/global/scholars/useScholarView";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import ViewScholar from "./(view)/ViewScholar";
import useGetScholar from "@/hooks/scholars/useGetScholar";
import { scholarColumns } from "./(columns}/scholarColumns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Directory from "./(downloads)/directory/Directory";
import { useDirectory } from "@/app/global/scholars/downloads/useDirectory";
import Masterlist from "./(downloads)/(masterlist)/Masterlist";
import { useMasterlist } from "@/app/global/scholars/downloads/useMasterlist";
import { useUser } from "@/hooks/user/useUser";

export default function Page() {
    const { open, setOpen } = useScholarView();
    const { setOpen: setDirectoryOpen } = useDirectory();
    const { setOpen: setMasterlistOpen } = useMasterlist();
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");
    const [searchDebounce] = useDebounce(search, 500);
    let searchValue = search == "" ? search : searchDebounce;
    const { data: userData } = useUser();

    const { data, isFetching } = useGetScholar({
        page: page,
        search: searchValue,
    });

    const scholars = data?.data?.get_scholars;
    const user = userData?.data;
    const pagination = data?.data?.pagination;

    const columns = scholarColumns();
    return (
        <>
            <title>BNS | Scholars</title>
            <div className="flex gap-2">
                <Link href={"/scholars/create"}>
                    <Button>
                        <Plus /> Add Scholar
                    </Button>
                </Link>
                {user?.classification === "System Administrator" && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button>
                                <Download /> Download
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onClick={() => setDirectoryOpen(true)}
                                >
                                    Directory
                                    <DropdownMenuShortcut>
                                        <Download />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setMasterlistOpen(true)}
                                >
                                    Masterlist
                                    <DropdownMenuShortcut>
                                        <Download />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
            <Card className="px-6">
                <SearchBar onInput={(e: any) => setSearch(e.target.value)} />
                <DataTable
                    pagination={pagination}
                    page={page}
                    setPage={setPage}
                    data={scholars}
                    columns={columns}
                    isFetching={isFetching}
                />
            </Card>
            <ResponsiveDialog
                className="min-w-[1000px] max-h-[90vh] overflow-auto"
                title="View Scholar"
                open={open}
                setOpen={setOpen}
            >
                <ViewScholar />
            </ResponsiveDialog>
            <Directory />
            <Masterlist />
        </>
    );
}

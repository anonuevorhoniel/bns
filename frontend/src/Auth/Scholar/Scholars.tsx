import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    BookMarked,
    ChevronsUpDown,
    CirclePlus,
    Database,
    Search,
    Upload,
} from "lucide-react";

import { Link } from "react-router-dom";
import AutoPagination from "@/Reusable/AutoPagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import LoadingScreen from "@/LoadingScreen";
import { Toaster } from "sonner";
import ScholarTable from "./ScholarTable";
import { Label } from "@/components/ui/label";
import { ScholarShow } from "./Show/ScholarShow";
import { Input } from "@/components/ui/input";
import DirectoryDialog from "./Download/DirectoryDialog";
import MasterlistDialog from "./Download/MasterlistDialog";
import SelectCode from "./ScholarForm/SelectCode";
import UseScholar from "./UseScholar";

export default function Scholars() {

    const {
        scholars,
        page,
        open,
        setPage,
        offset,
        totalScholar,
        totalPage,
        cs_count,
        user,
        isFetching,
        setOpenDirectoryDialog,
        setOpen,
        setSearch,
        setOpenMasterlistDialog,
    } = UseScholar();

    return (
        <>
            <title>BNS | Scholars</title>
            <ScholarShow />
            <DirectoryDialog />
            <MasterlistDialog />
            <Toaster position="top-right" />
            {user?.assigned_muni_code == null && (
                <div className="flex justify-end gap-2 mb-3">
                    <Button variant={"link"}>
                        <Upload /> Upload Data
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white flex rounded-sm p-3 shadow-emerald-500/25 hover:-translate-y-0.5 hover:shadow-xl h-9 
                            text-sm items-center"
                        >
                            Download{" "}
                            <ChevronsUpDown size={18} className="ml-1" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onClick={() => setOpenDirectoryDialog(true)}
                            >
                                <Database /> Directory
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setOpenMasterlistDialog(true)}
                            >
                                <BookMarked /> Masterlist
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem>
                                <Medal /> Top BNS
                            </DropdownMenuItem> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            <Card className="p-0 pb-5">
                <CardHeader className="bg-muted rounded-tl-lg rounded-tr-lg pt-2">
                    <div className="grid gap-2 grid-cols-1 xl:grid-cols-2 ">
                        <div className="flex gap-3">
                            <Link to={"/scholars/create"}>
                                <Button variant={"primary"}>
                                    <CirclePlus /> Scholar
                                </Button>
                            </Link>

                            {user?.assigned_muni_code == null && (
                                <SelectCode open={open} setOpen={setOpen} />
                            )}
                        </div>
                        <div>
                            <div className="flex max-w-70 float-right space-x-2 relative">
                                <Search className="text-gray-500 w-4 h-4 absolute top-2 left-2 z-10 " />
                                <Input
                                    className="bg-white border-none hover:bg-white pl-8 hover:-y-translate-none"
                                    placeholder="Search"
                                    onInput={(e: any) =>
                                        setSearch(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="p-0 relative">
                        {isFetching && <LoadingScreen />}
                        <ScholarTable data={scholars} />
                    </div>
                    <div className="grid grid-cols-1  lg:grid-cols-2 xs:grid-cols-1 sm:grid-cols-1">
                        <div
                            className={`flex justify-between mt-2 ${
                                isFetching ? "pointer-events-none" : ""
                            }`}
                        >
                            <div className=" flex items-center">
                                {" "}
                                <Label>
                                    Showing{" "}
                                    {totalScholar > 0 ? offset + 1 : offset} to{" "}
                                    {offset + cs_count} of {totalScholar}{" "}
                                    scholars
                                </Label>
                            </div>
                            <div className=""></div>
                        </div>
                        <div className="flex items-center justify-end">
                            {" "}
                            <div>
                                <AutoPagination
                                    totalPage={totalPage}
                                    page={page}
                                    setPage={setPage}
                                    loading={isFetching}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

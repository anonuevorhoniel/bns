import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    BookMarked,
    ChevronsUpDown,
    CirclePlus,
    Database,
    Medal,
    Search,
    Upload,
} from "lucide-react";

import { Link } from "react-router-dom";
import { UseMuni } from "@/Actions/MunicipalityAction";
import { useEffect, useState } from "react";
import AutoPagination from "@/Reusable/AutoPagination";
import { UseLayout } from "@/Actions/LayoutAction";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UseGetScholar } from "@/Actions/ScholarAction";
import LoadingScreen from "@/LoadingScreen";
import { Toaster } from "sonner";
import ScholarTable from "./ScholarTable";
import { Label } from "@/components/ui/label";
import { ScholarShow } from "./Show/ScholarShow";
import { Input } from "@/components/ui/input";
import { useDirectory, useMasterlist } from "@/Actions/DownloadAction";
import DirectoryDialog from "./Download/DirectoryDialog";
import MasterlistDialog from "./Download/MasterlistDialog";
import SelectCode from "./ScholarForm/SelectCode";

export default function Scholars() {
    const { getAllMuni } = UseMuni();
    const {
        GetScholars,
        setPage,
        page,
        totalPage,
        loading,
        code,
        totalScholar,
        offset,
        cs_count,
    } = UseGetScholar();

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const { setItem, setBItem } = UseLayout();
    const { setOpenDirectoryDialog } = useDirectory();
    const { setOpenMasterlistDialog } = useMasterlist();
    useEffect(() => {
        setItem("Scholars");
        setBItem(null);
        getAllMuni();
    }, []);

    useEffect(() => {
        if (search) {
            const timeout = setTimeout(() => {
                GetScholars(code, page, search);
            }, 1000);
            return () => clearTimeout(timeout);
        } else {
            GetScholars(code, page, search);
        }
    }, [code, page, search]);

    return (
        <>
            <title>BNS | Scholars</title>
            <ScholarShow />
            <DirectoryDialog />
            <MasterlistDialog />
            <Toaster position="top-right" />
            <div className="flex justify-end gap-2 mb-3">
                <Button variant={"link"}>
                    <Upload /> Upload Data
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white flex rounded-sm p-3 shadow-emerald-500/25 hover:-translate-y-0.5 hover:shadow-xl h-9 
                            text-sm items-center"
                    >
                        Download <ChevronsUpDown size={18} className="ml-1" />
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
                        <DropdownMenuItem>
                            <Medal /> Top BNS
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Card className="p-0 pb-5">
                <CardHeader className="bg-muted rounded-tl-lg rounded-tr-lg pt-2">
                    <div className="grid gap-2 grid-cols-1 xl:grid-cols-2 ">
                        <div className="flex gap-3">
                            <Link to={"/scholars/create"}>
                                <Button variant={"primary"}>
                                    <CirclePlus /> Scholar
                                </Button>
                            </Link>

                            <SelectCode open={open} setOpen={setOpen} />

                        </div>

                      <div >
                          <div className="flex justify-center items-center bg-white rounded-lg  max-w-70 float-right px-3 py-1 space-x-2">
                            <Search className="text-gray-500 w-5 h-5" />
                            <Input
                                className="bg-transparent border-none hover:bg-gray-100"
                                placeholder="Search"
                                onInput={(e: any) => setSearch(e.target.value)}
                            />
                        </div>
                      </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="p-0 relative border-1">
                        {loading && <LoadingScreen />}
                        <ScholarTable />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xs:grid-cols-1 sm:grid-cols-1">
                        <div
                            className={`flex justify-between mt-2 ${
                                loading ? "pointer-events-none" : ""
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
                        <div>
                            {" "}
                            <AutoPagination
                                totalPage={totalPage}
                                page={page}
                                setPage={setPage}
                                loading={loading}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

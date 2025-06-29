import { UseViewPayroll } from "@/Actions/PayrollAction";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import LoadingScreen from "@/LoadingScreen";
import AutoPagination from "@/Reusable/AutoPagination";
import { Pencil, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import { Input } from "@/components/ui/input";

export default function ViewPayroll() {
    const {
        viewPayroll,
        setViewPayroll,
        viewPayrollScholar,
        page,
        setPage,
        totalPage,
        id,
        loading,
        payroll,
    } = UseViewPayroll();
    const [search, setSearch] = useState<string>("");
    const ring = (
        <Ring size="20" stroke="5" bgOpacity="0" speed="2" color="blue" />
    );
    const isDesktop = useMediaQuery("(min-width: 768px)");

    useEffect(() => {
        if (id != undefined) {
            if (search) {
                const timeout = setTimeout(() => {
                    setViewPayroll(true, id, page, search);
                }, 1000);
                return () => clearTimeout(timeout);
            } else {
                setViewPayroll(true, id, page, search);
            }
        }
    }, [page, search]);

    useEffect(() => {
        setPage(1);
    }, [viewPayroll]);

    const content = (
        <>
            <div className="">
                <Label className="flex justify-center text-blue-900 text-xl text-center">
                    Barangay Nutrition Scholar Directory (
                    {payroll?.fund ? payroll?.fund : ring}) for{" "}
                    {payroll?.municipality ? payroll?.municipality : ring}{" "}
                    (2025)
                </Label>
                <div className="flex flex-col items-center text-blue-900 ">
                    <Label className="text-md">
                        {payroll?.month_from ? payroll?.month_from : ring} -{" "}
                        {payroll?.month_to ? payroll?.month_to : ring}{" "}
                        {payroll?.year ? payroll?.year : ring}
                    </Label>
                    <Label className="mt-3 text-xl">
                        P {payroll?.grand_total}
                    </Label>
                </div>
            </div>

            <Separator />
            <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-4">
                {payroll?.signatories.map((s: any) => {
                    return (
                        <div className="flex flex-col items-center mt-6 xl:mt-2 lg:mt-2">
                            <Label className="underline">{s.name}</Label>{" "}
                            <Label className="mt-2 text-xs">
                                {s.description}
                            </Label>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-end flex-col mt-3 mb-3">
                <div className="flex justify-end items-center gap-3">
                    <div className="flex items-center justify-center">
                        <Button variant={"warning"}>
                            <Pencil />
                            Signatories
                        </Button>
                    </div>
                    <div>
                        <div className="flex justify-center items-center bg-muted rounded-lg  max-w-70 float-right px-3 py-1 space-x-2">
                            <Search className="text-gray-500 w-5 h-5" />
                            <Input
                                className="bg-white border-none hover:bg-white"
                                placeholder="Search"
                                onInput={(e: any) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative">
                {loading && <LoadingScreen />}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center border-1 bg-black text-white">
                                First Name
                            </TableHead>
                            <TableHead className="text-center border-1 bg-black text-white">
                                MI
                            </TableHead>
                            <TableHead className="text-center border-1 bg-black text-white">
                                Last Name
                            </TableHead>
                            <TableHead className="text-center border-1 bg-black text-white">
                                Service Period
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {viewPayrollScholar &&
                            viewPayrollScholar?.map((m: any) => {
                                return (
                                    <TableRow key={m.id}>
                                        <TableCell className="text-center">
                                            {m.first_name}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {m.middle_name}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {m.last_name}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {m.service_period}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        {viewPayrollScholar?.length == 0 || viewPayrollScholar?.length == undefined ? (
                            <TableRow>
                                <TableCell className="text-center" colSpan={4}>
                                    No Scholars 
                                </TableCell>
                            </TableRow>
                        ) : (
                            ""
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2  mt-3 pl-3 pr-3 ">
                <div>
                    <Label>
                        Showing {payroll?.offset == 0 ? 1 : payroll?.offset + 1}{" "}
                        to {payroll?.offset + payroll?.current} of{" "}
                        {payroll?.total_scholar} Payroll Members
                    </Label>
                </div>

                <div className={`${loading && "pointer-events-none"}`}>
                    <AutoPagination
                        page={page}
                        totalPage={totalPage}
                        setPage={setPage}
                    />
                </div>
            </div>
        </>
    );

    if (isDesktop) {
        return (
            <>
                <Dialog open={viewPayroll} onOpenChange={setViewPayroll}>
                    <DialogTitle />
                    <DialogContent className="max-w-[805px] md:max-w-[800px] lg:max-w-[1000px] xl:max-w-[1205px]">
                        <DialogHeader />
                        {content}
                        <DialogDescription />
                        <DialogFooter />
                    </DialogContent>
                </Dialog>
            </>
        );
    } else {
        return (
            <>
                <Drawer open={viewPayroll} onOpenChange={setViewPayroll}>
                    <DrawerTitle />
                    <DrawerContent className="">
                        <div className="overflow-auto p-3">{content}</div>

                        <DrawerDescription />
                        <DrawerHeader />
                        <DrawerFooter>
                            <DrawerClose className="border-1 shadow-lg rounded-lg p-2">
                                Close
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </>
        );
    }
}

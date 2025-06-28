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
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";

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

    useEffect(() => {
        if (id != undefined) {
            setViewPayroll(true, id, page);
        }
    }, [page]);
    const ring = (
        <Ring size="20" stroke="5" bgOpacity="0" speed="2" color="blue" />
    );
    const isDesktop = useMediaQuery("(min-width: 768px)");

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
                    <Label className="mt-3 text-xl">P {payroll?.grand_total}</Label>
                </div>
            </div>

            <Separator />
            <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-4">
                {payroll?.signatories.map((s: any) => {
                   return <div className="flex flex-col items-center mt-6 xl:mt-2 lg:mt-2">
                        <Label className="underline">{s.name}</Label>{" "}
                        <Label className="mt-2 text-xs">
                            {s.description}
                        </Label>
                    </div>;
                })}
                {/* <div className="flex flex-col items-center mt-6 xl:mt-2 lg:mt-2">
                    <Label className="underline">TERESITA S. RAMOS</Label>{" "}
                    <Label className="mt-2 text-xs">
                        Provincial Nutrition Action Officer
                    </Label>
                </div> */}
                {/* <div className="flex flex-col items-center mt-6 xl:mt-2 lg:mt-2">
                    <Label className="underline">SOL ARAGONES</Label>{" "}
                    <Label className="mt-2 text-xs">Governor</Label>
                </div>
                <div className="flex flex-col items-center mt-6 xl:mt-2 lg:mt-2">
                    <Label className="underline">JOIPHYLEN C. BACANTO</Label>{" "}
                    <Label className="mt-2 text-xs">
                        OIC - Provincial Accounting Office
                    </Label>
                </div>
                <div className="flex flex-col items-center mt-6 xl:mt-2 lg:mt-2">
                    <Label className="underline">SOL ARAGONES</Label>{" "}
                    <Label className="mt-2 text-xs">
                        Chairman-Provincial Nutrition Comittee
                    </Label>
                </div> */}
            </div>
            <div>
                <Button
                    variant={"warning"}
                    className="mb-3 xl:mb-1 float-right mt-4"
                >
                    <Pencil />
                    Signatories
                </Button>
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
                    </TableBody>
                </Table>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2  mt-3 pl-3 pr-3 ">
                <div>
                    <Label>Showing 1 to 1 of 1 Payroll Members</Label>
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

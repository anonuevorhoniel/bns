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
import AutoPagination from "@/Reusable/AutoPagination";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";

export default function ViewPayroll() {
    const { viewPayroll, setViewPayroll, viewPayrollScholar } =
        UseViewPayroll();
    const [page, setPage] = useState(1);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const content = (
        <>
            <div className="flex justify-end mr-5">
                <Button className="mb-3 xl:mb-1">
                    <Pencil /> Edit Signatories
                </Button>
            </div>
            <Label className="flex justify-center text-blue-900 text-xl text-center">
                Barangay Nutrition Scholar Directory (LOCAL) for Alaminos (2025)
            </Label>
            <div className="flex flex-col items-center text-blue-900">
                <Label className="text-md"> January - December 2025</Label>
                <Label className="mt-3 text-xl">P 2500</Label>
            </div>
            <Separator />
            <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-4">
                <div className="flex flex-col items-center mt-6 xl:mt-2 lg:mt-2">
                    <Label className="underline">TERESITA S. RAMOS</Label>{" "}
                    <Label className="mt-2">
                        Provincial Nutrition Action Officer
                    </Label>
                </div>
                <div className="flex flex-col items-center mt-6 xl:mt-2 lg:mt-2">
                    <Label className="underline">SOL ARAGONES</Label>{" "}
                    <Label className="mt-2">Governor</Label>
                </div>
                <div className="flex flex-col items-center mt-6 xl:mt-2 lg:mt-2">
                    <Label className="underline">JOIPHYLEN C. BACANTO</Label>{" "}
                    <Label className="mt-2">
                        OIC - Provincial Accounting Office
                    </Label>
                </div>
                <div className="flex flex-col items-center mt-6 xl:mt-2 lg:mt-2">
                    <Label className="underline">SOL ARAGONES</Label>{" "}
                    <Label className="mt-2">
                        Chairman-Provincial Nutrition Comittee
                    </Label>
                </div>
            </div>
            <Table className="mt-5">
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
                           return <TableRow>
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
                            </TableRow>;
                        })}
                </TableBody>
            </Table>

            <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2  mt-3 pl-3 pr-3 ">
                <div>
                    <Label>Showing 1 to 1 of 1 Payroll Members</Label>
                </div>

                <div>
                    <AutoPagination
                        page={page}
                        totalPage={1}
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
                        <div className="overflow-auto">{content}</div>

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

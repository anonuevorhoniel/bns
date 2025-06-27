import {  UseViewPayroll } from "@/Actions/PayrollAction";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronsUpDown, Download, Eye, ListChecks } from "lucide-react";

export default function PayrollTable({payrolls}: any) {
    const {  setViewPayroll } = UseViewPayroll();
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="rounded-tl-lg text-black/50">
                            <Label className="flex justify-center">
                                Fund <ChevronsUpDown size={15} />
                            </Label>
                        </TableHead>
                        <TableHead className=" text-black/50">
                            <Label className="flex justify-center">
                                Date Created
                                <ChevronsUpDown size={15} />
                            </Label>
                        </TableHead>
                        <TableHead className=" text-black/50">
                            <Label className="flex justify-center">
                                Municipality
                                <ChevronsUpDown size={15} />
                            </Label>
                        </TableHead>
                        <TableHead className=" text-black/50">
                            <Label className="flex justify-center">
                                Period Covered
                                <ChevronsUpDown size={15} />
                            </Label>
                        </TableHead>
                        <TableHead className=" text-black/50 rounded-tr-lg">
                            <Label className="flex justify-center">
                                Action <ChevronsUpDown size={15} />
                            </Label>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payrolls &&
                        payrolls?.map((p: any) => {
                            return (
                                <TableRow key={p.id}>
                                    <TableCell className="text-center">
                                        {p.fund}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {p.created_at}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {p.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {p.period_cover}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant={"primary"}
                                            size={"icon"}
                                            onClick={() => setViewPayroll(true, p.id)}
                                        >
                                            <Eye />
                                        </Button>
                                        <Button
                                            className="ml-2"
                                            variant={"success"}
                                        >
                                            <Download />
                                        </Button>
                                        <Button
                                            className="ml-2"
                                            variant={"warning"}
                                        >
                                            <ListChecks /> Masterlist
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    {payrolls?.length > 0 ? (
                        ""
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                No Payrolls
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}

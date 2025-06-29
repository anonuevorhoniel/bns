import { UseDownloadMasterlist, UseDownloadPayroll, UseViewPayroll } from "@/Actions/PayrollAction";
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
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";

export default function PayrollTable({ payrolls }: any) {
    const { setViewPayroll } = UseViewPayroll();
    const { download, loadingId } = UseDownloadPayroll();
    const {downloadMasterlist, loadingIdMasterlist} = UseDownloadMasterlist();
    const ring = (
        <Ring2
            size="20"
            stroke="5"
            strokeLength="0.25"
            bgOpacity="0.1"
            speed="0.8"
            color="white"
        />
    );
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
                                            onClick={() =>
                                                setViewPayroll(true, p.id, 1)
                                            }
                                        >
                                            <Eye />
                                        </Button>
                                        <Button
                                            className="ml-2"
                                            variant={"success"}
                                            disabled={loadingId == p.id}
                                            onClick={() => download(p.id)}
                                        >
                                            {loadingId == p.id ? (
                                                ring
                                            ) : (
                                                <Download />
                                            )}
                                        </Button>
                                        <Button
                                            className="ml-2"
                                            variant={"warning"}
                                                  onClick={() => downloadMasterlist(p.id)}
                                        >
                                            {loadingIdMasterlist == p.id ? (
                                                ring
                                            ) : (
                                                <><ListChecks /> Masterlist</>
                                            )}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    {payrolls?.length > 0 ? (
                        ""
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                No Payrolls
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}

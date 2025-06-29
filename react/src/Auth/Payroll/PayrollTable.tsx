import {
    UseDownloadMasterlist,
    UseDownloadPayroll,
    UseViewPayroll,
} from "@/Actions/PayrollAction";
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
import {
    Building2,
    Calendar,
    CalendarRange,
    CircleDollarSign,
    Download,
    Eye,
    ListChecks,
} from "lucide-react";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";
import { BadgeFund } from "@/Reusable/BadgeFund";

export default function PayrollTable({ payrolls }: any) {
    const { setViewPayroll } = UseViewPayroll();
    const { download, loadingId } = UseDownloadPayroll();
    const { downloadMasterlist, loadingIdMasterlist } = UseDownloadMasterlist();

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
                        <TableHead className="rounded-tl-lg opacity-60">
                            <Label className="flex justify-center">
                                <CircleDollarSign size={15} /> Fund
                            </Label>
                        </TableHead>
                        <TableHead className=" opacity-60">
                            <Label className="flex justify-center">
                                <Calendar size={15} />
                                Date Created
                            </Label>
                        </TableHead>
                        <TableHead className=" opacity-60">
                            <Label className="flex justify-center">
                                <Building2 size={15} />
                                Municipality
                            </Label>
                        </TableHead>
                        <TableHead className=" opacity-60">
                            <Label className="flex justify-center">
                                <CalendarRange size={15} />
                                Period Covered
                            </Label>
                        </TableHead>
                        <TableHead className=" opacity-60 rounded-tr-lg">
                            <Label className="flex justify-center">
                                Action
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
                                        {BadgeFund(p.fund)}
                                    </TableCell>
                                    <TableCell className="flex flex-col items-center">
                                        <Label>{p.created_at}</Label>
                                        <Label className="mt-1 text-xs opacity-60">
                                            {p.diff_time}
                                        </Label>
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
                                            onClick={() =>
                                                downloadMasterlist(p.id)
                                            }
                                        >
                                            {loadingIdMasterlist == p.id ? (
                                                ring
                                            ) : (
                                                <>
                                                    <ListChecks /> Masterlist
                                                </>
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

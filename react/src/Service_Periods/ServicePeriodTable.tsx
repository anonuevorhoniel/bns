import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    deleteServicePeriod,
    UseServicePeriod,
    UseStoreServicePeriod,
    UseViewServicePeriod,
} from "../Actions/ServicePeriodAction";
import {
    Building2,
    CalendarRange,
    CircleDollarSignIcon,
    Eye,
    User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { BadgeFund } from "@/Reusable/BadgeFund";

export default function ServicePeriodTable() {
    const { data, pages } = UseServicePeriod();
    const {
        setViewOpen,
        setDataView,
        viewPage,
        viewOpen,
        setScholarId,
        scholarId,
    } = UseViewServicePeriod();
    const { storeSingleRefresh } = UseStoreServicePeriod();

    const { dataView } = UseViewServicePeriod();
    const { refresh } = deleteServicePeriod();
    let totalScholars = pages?.total_scholars;

    useEffect(() => {
        scholarId && setDataView();
    }, [viewPage, viewOpen, refresh, storeSingleRefresh]);

    useEffect(() => {
        dataView?.[0] ? "" : setViewOpen(false);
    }, [dataView]);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <div className="opacity-50 flex justify-center items-center gap-2">
                            <CircleDollarSignIcon size={15} /> Fund
                        </div>
                    </TableHead>
                    <TableHead>
                        <div className="opacity-50 flex justify-center items-center gap-2">
                            <User size={15} /> Name
                        </div>
                    </TableHead>
                    <TableHead>
                        {" "}
                        <div className="flex gap-2 justify-center items-center opacity-50">
                            <Building2 size={15} /> Municipality
                        </div>
                    </TableHead>
                    <TableHead className=" flex justify-center items-center gap-2 opacity-50 hidden sm:flex">
                        <CalendarRange size={15} />
                        Recent Period
                    </TableHead>
                    <TableHead className="text-center opacity-50">
                        Action
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.map((s: any) => {
                    return (
                        <TableRow key={s.id}>
                            <TableCell>
                                <div className="flex justify-center">
                                    {BadgeFund(s.fund)}
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                {s.full_name}
                            </TableCell>
                            <TableCell className="text-center">
                                {s.name}
                            </TableCell>
                            <TableCell className="text-center  hidden sm:table-cell">
                                <Badge> {s.recent_period}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                                <Button
                                    size={"icon"}
                                    variant={"primary"}
                                    onClick={() => {
                                        setViewOpen(true);
                                        setScholarId(s.id);
                                    }}
                                >
                                    <Eye />
                                </Button>
                            </TableCell>
                        </TableRow>
                    );
                })}
                {totalScholars == 0 || totalScholars == undefined ? (
                    <TableRow>
                        <TableCell className="text-center" colSpan={5}>
                            No Scholars with Service Periods
                        </TableCell>
                    </TableRow>
                ) : (
                    ""
                )}
            </TableBody>
        </Table>
    );
}

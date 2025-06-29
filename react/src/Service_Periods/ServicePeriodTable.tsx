import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { UseServicePeriod } from "./Actions/ServicePeriodAction";
import { useEffect } from "react";
import { ChevronsUpDown } from "lucide-react";

export default function ServicePeriodTable() {
    const {
        servicePeriodData,
        getServicePeriodData,
        servicePeriodDataPage,
    } = UseServicePeriod();

    useEffect(() => {
        getServicePeriodData();
    }, [servicePeriodDataPage]);

    useEffect(() => {
        console.log(servicePeriodData);
    }, [servicePeriodData]);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <div className="flex gap-2 justify-center items-center">
                            Municipality <ChevronsUpDown size={15} />
                        </div>
                    </TableHead>
                    <TableHead className="text-center">Name</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {servicePeriodData?.map((s: any) => {
                    return (
                        <TableRow>
                            <TableCell className="text-center">
                                {s.full_name}
                            </TableCell>
                            <TableCell className="text-center">
                                {s.name}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

import { UseViewPayroll } from "@/Actions/PayrollAction";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function ViewPayrollTable() {
    const { viewPayrollScholar } = UseViewPayroll();
    return (
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
                {viewPayrollScholar?.length == 0 ||
                viewPayrollScholar?.length == undefined ? (
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
    );
}

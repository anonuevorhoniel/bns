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
    CalendarPlus2,
    SquareMousePointer,
    TextSearch,
    User,
} from "lucide-react";

export default function AuditTrailTable({ auditData }: any) {
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow className="opacity-70">
                        <TableHead>
                            <div className="flex justify-center">
                                <Label>
                                    <User size={15} /> User
                                </Label>
                            </div>
                        </TableHead>
                        <TableHead>
                            <div className="flex justify-center">
                                <Label>
                                    <CalendarPlus2 size={15} /> Date Created
                                </Label>
                            </div>
                        </TableHead>
                        <TableHead>
                            <div className="flex justify-center">
                                <Label>
                                    <SquareMousePointer size={15} /> Action
                                </Label>
                            </div>
                        </TableHead>
                        <TableHead>
                            <div className="flex justify-center">
                                <Label>
                                    <TextSearch size={15} /> Description
                                </Label>
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {auditData?.map((a: any) => {
                        return (
                            <TableRow key={a.id}>
                                <TableCell className="text-center">
                                    {a.name}
                                </TableCell>
                                <TableCell className="text-center">
                                    {a.created_at}
                                </TableCell>
                                <TableCell className="text-center">
                                    {a.action}
                                </TableCell>
                                <TableCell className="text-center break-all whitespace-normal">
                                    {a.description}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {(auditData?.length == 0 ||
                        auditData?.length == undefined) && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                No Audit Trails
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}

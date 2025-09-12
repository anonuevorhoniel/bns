import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "../ui/label";

export default function SkeletonTable({
    columnTotal,
}: {
    columnTotal: number;
}) {
    const header = () => {
        let headers = [];
        for (let i = 0; i < columnTotal; i++) {
            headers.push(
                <TableHead key={i}>
                    <Skeleton className="h-4 w-30" />
                </TableHead>
            );
        }
        return headers;
    };

    const body = () => {
        let body = [];
        for (let i = 0; i < columnTotal; i++) {
            body.push(
                <TableCell key={i} className="h-13">
                    <Skeleton className="h-5 w-full" />
                </TableCell>
            );
        }
        return body;
    };
    return (
        <div className="border rounded-lg w-full">
            <div className="relative w-full overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>{header()}</TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>{body()}</TableRow>
                        <TableRow>{body()}</TableRow>
                        <TableRow>{body()}</TableRow>
                        <TableRow>{body()}</TableRow>
                        <TableRow>{body()}</TableRow>
                        <TableRow>{body()}</TableRow>
                        <TableRow>{body()}</TableRow>
                        <TableRow>{body()}</TableRow>
                    </TableBody>
                </Table>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-white rounded-md z-10 shadow-lg p-3 px-6 flex gap-3 items-center">
                       <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> <Label className="text-black">
                        Loading...
                       </Label>
                   </div>
                </div>
            </div>
        </div>
    );
}

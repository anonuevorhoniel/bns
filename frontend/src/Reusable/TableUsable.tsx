import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableHeader,
} from "@/components/ui/table";
import LoadingScreen from "@/LoadingScreen";

export default function TableUsable({ loading, tableheader, data, className }: any) {
    return (
        <>
            <div className="flex justify-end">
                <Input className="w-3xs mt-3" placeholder="Search" />
            </div>

            <Card className={`p-0 pb-5 relative mt-4 ${className}`}>
                {loading && <LoadingScreen />}
                <Table>
                    <TableHeader>
                        {tableheader}
                    </TableHeader>
                    <TableBody>
                        {data}
                    </TableBody>
                </Table>
            </Card>
        </>
    );
}

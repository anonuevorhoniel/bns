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
import { Card } from "../ui/card";

export default function CardSkeleton({ columnTotal }: { columnTotal: number }) {
    const columns = () => {
        let columnArray = [];
        for (let i = 0; i < columnTotal; i++) {
            columnArray.push(
                <div className="space-y-3" key={i}>
                    <Skeleton className="w-30 h-3" />
                    <Skeleton className="w-60 h-3" />
                </div>
            );
        }

        return columnArray;
    };
    return (
        <div className="space-y-5 relative w-full overflow-auto">
            <Card className="px-6">
                <div className="flex flex-col gap-2 space-y-7">{columns()}</div>
            </Card>

            <Card className="px-6">
                <div className="flex flex-col gap-2 space-y-7">{columns()}</div>
            </Card>

            <Card className="px-6">
                <div className="flex flex-col gap-2 space-y-7">{columns()}</div>
            </Card>

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-md z-10 shadow-lg p-3 px-6 flex gap-3 items-center">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />{" "}
                    <Label className="text-black">Loading...</Label>
                </div>
            </div>
        </div>
    );
}

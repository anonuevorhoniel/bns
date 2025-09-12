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
    const header = () => {
        let headers = [];
        for (let i = 0; i < columnTotal; i++) {
            headers.push(
                <div key={i}>
                    <Skeleton className="h-4 w-30" />
                </div>
            );
        }
        return headers;
    };

    const body = () => {
        let body = [];
        for (let i = 0; i < columnTotal; i++) {
            body.push(
                <div key={i} className="">
                    <Skeleton className="h-5 w-full" />
                </div>
            );
        }
        return body;
    };
    return (
            <div className="space-y-5 relative w-full overflow-auto">
                <Card>
                    <div className="flex  justify-between items-center px-6">
                        <div className="flex flex-col gap-5 w-full">
                            {header()}
                        </div>
                        <div className="flex flex-col gap-5 w-full">
                            {body()}
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex  justify-between items-center px-6">
                        <div className="flex flex-col gap-5 w-full">
                            {header()}
                        </div>
                        <div className="flex flex-col gap-5 w-full">
                            {body()}
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex  justify-between items-center px-6">
                        <div className="flex flex-col gap-5 w-full">
                            {header()}
                        </div>
                        <div className="flex flex-col gap-5 w-full">
                            {body()}
                        </div>
                    </div>
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

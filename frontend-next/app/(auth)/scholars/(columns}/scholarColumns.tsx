import { useScholarView } from "@/app/global/scholars/useScholarView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import StatusBar from "@/components/ui/status";
import { Info, MapPin, Pen, Search } from "lucide-react";
import Link from "next/link";

export function scholarColumns() {
    const funds = ["NNC", "LOCAL", "BOTH"];
    const { setOpen, setScholar } = useScholarView();
    return [
        {
            header: "Replacement Status",
            cell: (data: any) => {
                return <StatusBar inverted status={data?.replaced} />;
            },
        },
        {
            header: "Full Name",
            cell: (data: any) => {
                return (
                    <div className="flex flex-col gap-1 items-end text-end lg:items-start lg:text-end text-wrap break-all max-w-[150px] lg:max-w-full">
                        <Label>{data.full_name}</Label>
                        <div className="flex gap-1">
                            <MapPin size={15} />
                            <Label className="text-xs">
                                {data.municity_name}
                            </Label>
                        </div>
                    </div>
                );
            },
        },
        {
            accessKey: "barangay_name",
            header: "Barangay Name",
        },
        {
            header: "Fund",
            cell: (data: any) =>
                data.fund ? (
                    <>
                        <Badge>{data.fund}</Badge>
                        {!funds.includes(data.fund) && (
                            <div className="flex items-center gap-1">
                                <Info className="text-yellow-500" size={12} />
                                <p className="text-xs text-yellow-500">
                                    Please change
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <Badge
                        variant={"outline"}
                        className="text-red-500 border-red-500"
                    >
                        Unknown
                    </Badge>
                ),
        },
        {
            header: "Action",
            cell: (data: any) => {
                return (
                    <div className="flex gap-2">
                        <Button
                            size={"sm"}
                            onClick={() => {
                                setOpen(true);
                                setScholar(data);
                            }}
                        >
                            <Search />
                        </Button>
                        <Link href={`/scholars/${data.id}/edit`}>
                            <Button size={"sm"} variant={"destructive"}>
                                <Pen />
                            </Button>
                        </Link>
                    </div>
                );
            },
        },
    ];
}

import { useScholarView } from "@/app/global/scholars/useScholarView";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import StatusBar from "@/components/ui/status";
import { MapPin, Pen, Search } from "lucide-react";
import Link from "next/link";

export function scholarColumns() {
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
            accessKey: "fund",
            header: "Fund",
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
                                console.log(data);
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

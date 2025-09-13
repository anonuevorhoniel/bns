import { usePayrollView } from "@/app/global/payrolls/usePayrollView";
import { useDownload } from "@/app/global/scholars/downloads/useDowload";
import ButtonLoad from "@/components/custom/button-load";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarDays, Download, Search } from "lucide-react";
import { useState } from "react";

export default function payrollColumn({
    downloadMasterlist,
    downloadPayroll,
}: {
    downloadPayroll: any;
    downloadMasterlist: any;
}) {
    const { setOpen, setId, setPayrollView } = usePayrollView();
    const { setId: setDownloadId, id: downloadID } = useDownload();
    const [search, setSearch] = useState("");
    return [
        {
            header: "Fund",
            cell: (data: any) => {
                return <Badge>{data.fund}</Badge>;
            },
        },
        {
            header: "Created At",
            cell: (data: any) => (
                <div className="flex justify-start items-end">
                    <div className="flex gap-1 items-start">
                        <CalendarDays className="stroke-1 " />
                        <div className="text-left flex flex-col items-start">
                            <Label>{data.created_at}</Label>
                            <Label className="text-xs font-normal opacity-60 text-right">
                                {data?.diff_time}
                            </Label>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            accessKey: "name",
            header: "Muni / City",
        },
        {
            accessKey: "period_cover",
            header: "Period Covered",
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
                                setId(data.id);
                                setPayrollView(true);
                            }}
                        >
                            <Search />
                        </Button>
                        <ButtonLoad
                            size={"sm"}
                            label={
                                <>
                                    <Download /> Payroll
                                </>
                            }
                            onClick={() => {
                                setDownloadId(data.id);
                                downloadPayroll.mutate();
                            }}
                            isPending={
                                downloadPayroll.isPending &&
                                downloadID == data.id
                            }
                        />
                        <ButtonLoad
                            size={"sm"}
                            label={
                                <>
                                    <Download /> Masterlist
                                </>
                            }
                            onClick={() => {
                                setDownloadId(data.id);
                                downloadMasterlist.mutate();
                            }}
                            isPending={
                                downloadMasterlist.isPending &&
                                downloadID == data.id
                            }
                        />
                    </div>
                );
            },
        },
    ];
}

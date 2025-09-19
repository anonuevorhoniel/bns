import { usePayrollView } from "@/app/global/payrolls/usePayrollView";
import { useDownload } from "@/app/global/scholars/downloads/useDowload";
import ButtonLoad from "@/components/custom/button-load";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/user/useUser";
import { CalendarDays, Check, Download, Search } from "lucide-react";
import { useState } from "react";
import payrollMutations from "../(mutations)/payrollMutations";

export default function payrollColumn() {
    const { downloadMasterlist, downloadPayroll, approvePayroll } =
        payrollMutations();
    const { setOpen, setId, setPayrollView } = usePayrollView();
    const { setId: setDownloadId, id: downloadID } = useDownload();
    const { data: user } = useUser();
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
                        {/* <CalendarDays className="stroke-1 " /> */}
                        <div className="text-left flex flex-col items-start">
                            <Label className="">{data.created_at}</Label>
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
            header: "Rate",
            cell: (item: any) => {
                if (item.rate != null) {
                   return <Label className="text-green-500">₱{item.rate}</Label>;
                }
                return <Badge>{item.fund} Incentive</Badge>
            },
        },
        {
            header: "Action",
            cell: (item: any) => {
                return (
                    <div className="flex gap-2">
                        <Button
                            size={"sm"}
                            onClick={() => {
                                setOpen(true);
                                setId(item.id);
                                setPayrollView(true);
                            }}
                        >
                            <Search />
                        </Button>
                        {item.status == 1 && (
                            <>
                                <ButtonLoad
                                    size={"sm"}
                                    label={
                                        <>
                                            <Download /> Payroll
                                        </>
                                    }
                                    onClick={() => {
                                        setDownloadId(item.id);
                                        downloadPayroll.mutate();
                                    }}
                                    isPending={
                                        downloadPayroll.isPending &&
                                        downloadID == item.id
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
                                        setDownloadId(item.id);
                                        downloadMasterlist.mutate();
                                    }}
                                    isPending={
                                        downloadMasterlist.isPending &&
                                        downloadID == item.id
                                    }
                                />
                            </>
                        )}
                        {item.status == 0 &&
                            user?.data?.classification ==
                                "System Administrator" && (
                                <ButtonLoad
                                    size={"sm"}
                                    onClick={() => {
                                        setDownloadId(item.id);
                                        approvePayroll.mutate();
                                    }}
                                    isPending={
                                        approvePayroll.isPending &&
                                        downloadID == item.id
                                    }
                                    label={
                                        <>
                                            <Check size={15} /> Approve
                                        </>
                                    }
                                />
                            )}
                    </div>
                );
            },
        },
    ];
}

import ax from "@/app/axios";
import { useViewServicePeriod } from "@/app/global/service-periods/useViewServicePeriod";
import DataTable from "@/components/custom/datatable";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function ViewServicePeriod() {
    const { open, setOpen, scholar } = useViewServicePeriod();
    const [page, setPage] = useState(1);
    const { data, isSuccess, isError, error, isFetching } = useQuery({
        queryKey: ["viewServicePeriod", scholar?.id],
        queryFn: async () =>
            await ax.post(`/service_periods/${scholar?.id}/show`, {
                page: page,
            }),
        enabled: !!scholar?.id,
    });

    if (isSuccess) {
        console.log(data?.data);
    }

    if (isError) {
        console.log(error);
    }

    const columns = [
        {
            accessKey: "from",
            header: "From",
        },
        {
            accessKey: "to",
            header: "To",
        },
    ];
    return (
        <ResponsiveDialog
            title="View Service Period"
            open={open}
            setOpen={setOpen}
            className="min-w-[700px]"
        >
            <div className="flex gap-2">
                <Avatar className="h-15 w-15">
                    <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center gap-2">
                    <Label className="font-bold">{scholar?.full_name}</Label>
                    <Badge>{scholar?.fund}</Badge>
                </div>
            </div>

            <Card className="px-6 mt-5 lg:mt-1">
                <DataTable
                    page={page}
                    setPage={setPage}
                    isFetching={isFetching}
                    columns={columns}
                    data={data?.data?.service_periods}
                    pagination={data?.data?.pagination}
                />
            </Card>
        </ResponsiveDialog>
    );
}

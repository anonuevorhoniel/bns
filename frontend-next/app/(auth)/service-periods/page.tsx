"use client";

import ax from "@/app/axios";
import ContentLayout from "@/app/ContentLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/custom/datatable";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useCreateServicePeriod } from "@/app/global/service-periods/useCreateServicePeriod";
import CreateServicePeriod from "./(create)/CreateServicePeriod";

export default function Page() {
    const [page, setPage] = useState<number>(1);
    const { setOpen } = useCreateServicePeriod();
    const { data, isFetching, isError, error, isSuccess } = useQuery({
        queryKey: ["servicePeriods", page],
        queryFn: async () => await ax.post("/service_periods", { page: page }),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });

    if (isSuccess) {
        console.log(data);
    }

    const columns = [
        {
            header: "Fund",
            cell: (data: any) => {
                return <Badge>{data?.fund || "Unknown"}</Badge>;
            },
        },
        {
            accessKey: "full_name",
            header: "Full Name",
        },
        {
            accessKey: "name",
            header: "Municipality",
        },
        {
            accessKey: "recent_period",
            header: "Recent Period",
        },
        {
            header: "Action",
            cell: (data: any) => {
                return (
                    <Button>
                        <Search />
                    </Button>
                );
            },
        },
    ];
    return (
        <>
            <title>BNS | Service Periods</title>
            <div>
                <Button size={"sm"} onClick={() => setOpen(true)}>
                    <Plus /> Create Service Period
                </Button>
            </div>
            <DataTable
                page={page}
                setPage={setPage}
                data={data?.data?.volunteers}
                columns={columns}
                isFetching={isFetching}
            />
            <CreateServicePeriod />
        </>
    );
}

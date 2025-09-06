"use client";

import ax from "@/app/axios";
import ContentLayout from "@/app/ContentLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/datatable";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Page() {
    const [page, setPage] = useState<number>(1);
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
                return <Badge>{data?.fund || 'Unknown'}</Badge>
            }
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
            header: 'Action',
            cell: (data: any) => {
                return <Button><Search /></Button>
            }
        }
    ];
    return (
        <ContentLayout
            title="Service Periods"
            buttonEvent={() => console.log("a")}
        >
            <title>BNS | Service Periods</title>
            <DataTable
                page={page}
                setPage={setPage}
                totalPage={data?.data?.pages?.total_page}
                data={data?.data?.volunteers}
                columns={columns}
                isFetching={isFetching}
            />
        </ContentLayout>
    );
}

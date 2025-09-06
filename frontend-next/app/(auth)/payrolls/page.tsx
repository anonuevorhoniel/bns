"use client";

import ax from "@/app/axios";
import ContentLayout from "@/app/ContentLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DataTable from "@/components/ui/datatable";
import { Label } from "@/components/ui/label";
import SearchBar from "@/components/ui/searchbar";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CalendarDays, Download, Search } from "lucide-react";
import { useState } from "react";

export default function Page() {
    const [page, setPage] = useState(1);
    const { data, isSuccess, isError, error, isFetching } = useQuery({
        queryKey: ["payrolls", page],
        queryFn: async () => await ax.post("/payrolls", { page: page }),
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    });

    if (isError) {
        console.log(isError);
    }

    if (isSuccess) {
        console.log(data);
    }
    const columns = [
        {
            header: "Fund",
            cell: (data: any) => {
                return <Badge>{data.fund}</Badge>;
            },
        },
        {
            header: "Created At",
            cell: (data: any) => {
                return (
                    <>
                        <div className="flex gap-1 items-start">
                            <CalendarDays className="" />
                            <div>
                                <Label>{data.created_at}</Label>
                                <Label className="text-xs font-normal opacity-60">
                                    {data?.diff_time}
                                </Label>
                            </div>
                        </div>
                    </>
                );
            },
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
                        <Button size={"sm"}>
                            <Search />
                        </Button>
                        <Button size={"sm"}>
                            <Download />
                        </Button>
                        <Button size={"sm"}>
                            <Download /> Masterlist
                        </Button>
                    </div>
                );
            },
        },
    ];
    return (
        <ContentLayout
            buttonEvent={(e: any) => {
                console.log(e);
            }}
            title="Payrolls"
        >
            <title>BNS | Payrolls</title>
            <SearchBar />
            <DataTable
                page={page}
                setPage={setPage}
                totalPage={1}
                columns={columns}
                data={data?.data?.payrolls}
                isFetching={isFetching}
            />
        </ContentLayout>
    );
}

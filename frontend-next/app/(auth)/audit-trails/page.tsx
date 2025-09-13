"use client";

import ax from "@/app/axios";
import ContentLayout from "@/app/ContentLayout";
import DataTable from "@/components/custom/datatable";
import SearchBar from "@/components/custom/searchbar";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Page() {
    const [page, setPage] = useState<number>(1);
    const { data, isFetching, isError, error, isSuccess } = useQuery({
        queryKey: ["auditTrails"],
        queryFn: async () => await ax.post("/audit_trails"),
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    });

    if (isSuccess) {
        console.log(data?.data);
    }
    if (isError) {
        console.log(isError);
    }
    const columns = [
        {
            accessKey: "name",
            header: "User",
        },
        {
            accessKey: "action",
            header: "Action",
        },
        {
            header: "Description",
            cell: (item: any) => (
                <div className="max-w-xs flex">
                    <p className="break-all">{item.description}</p>
                </div>
            ),
        },
    ];
    return (
        <>
            <title>BNS | Audit Trails</title>
            <SearchBar />
            <DataTable
                data={data?.data?.trails}
                columns={columns}
                isFetching={isFetching}
                setPage={setPage}
                page={page}
            />
        </>
    );
}

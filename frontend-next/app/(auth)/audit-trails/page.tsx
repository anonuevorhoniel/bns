"use client";

import ax from "@/app/axios";
import ContentLayout from "@/app/ContentLayout";
import DataTable from "@/components/ui/datatable";
import SearchBar from "@/components/ui/searchbar";
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
            accessKey: "description",
            header: "Description",
            cellClass: "max-w-[170px]"
        },
    ];
    return (
        <ContentLayout
            title="Audit Trails"
            buttonEvent={() => console.log("a")}
        >
            <title>BNS | Audit Trails</title>
            <SearchBar />
            <DataTable
                data={data?.data?.trails}
                columns={columns}
                isFetching={isFetching}
                setPage={setPage}
                page={page}
                totalPage={1}
            />
        </ContentLayout>
    );
}

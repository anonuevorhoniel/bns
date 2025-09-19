"use client";

import ax from "@/app/axios";
import DataTable from "@/components/custom/datatable";
import SearchBar from "@/components/custom/searchbar";
import { Card } from "@/components/ui/card";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export default function Page() {
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState("");
    const [searchDebounce] = useDebounce(search, 500);
    const searchValue = search == "" ? search : searchDebounce;
    const { data, isFetching, isError, error, isSuccess } = useQuery({
        queryKey: ["auditTrails", page, searchValue],
        queryFn: async () =>
            await ax.post("/audit_trails", { page: page, search: searchValue }),
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    });

    if (isError) {
        console.log(error);
    }
    const columns = [
        {
            header: "User",
            cell: (item: any) => <>{item?.user?.name}</>,
        },
        {
            accessKey: "action",
            header: "Action",
        },
        {
            header: "Description",
            cell: (item: any) => (
                <div className=" flex">
                    <p className="break-all">{item.description}</p>
                </div>
            ),
        },
    ];
    return (
        <>
            <title>BNS | Audit Trails</title>
            <Card className="px-6">
                <SearchBar onInput={(e: any) => setSearch(e.target.value)} />
                <DataTable
                    data={data?.data?.trails}
                    columns={columns}
                    isFetching={isFetching}
                    setPage={setPage}
                    page={page}
                    pagination={data?.data?.pagination}
                />
            </Card>
        </>
    );
}

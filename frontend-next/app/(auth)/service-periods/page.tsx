"use client";

import ax from "@/app/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/custom/datatable";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useCreateServicePeriod } from "@/app/global/service-periods/useCreateServicePeriod";
import CreateServicePeriod from "./(create)/CreateServicePeriod";
import { Card } from "@/components/ui/card";
import SearchBar from "@/components/custom/searchbar";
import { useSearch } from "@/hooks/useSearch";
import { useDebounce } from "use-debounce";
import { useViewServicePeriod } from "@/app/global/service-periods/useViewServicePeriod";
import ViewServicePeriod from "./(view)/ViewServicePeriod";

export default function Page() {
    const [page, setPage] = useState<number>(1);
    const { open, setOpen: setViewOpen, setScholar } = useViewServicePeriod();
    const [search, setSearch] = useState("");
    const [searchDebounce] = useDebounce(search, 500);
    const searchValue = search == "" ? search : searchDebounce;
    const { setOpen } = useCreateServicePeriod();
    const { data, isFetching, isError, error, isSuccess } = useQuery({
        queryKey: ["servicePeriods", page, searchValue],
        queryFn: async () =>
            await ax.post("/service_periods", {
                page: page,
                search: searchValue,
            }),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });

    if (isError) {
        console.log(error);
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
            cell: (item: any) => {
                return (
                    <Button
                        onClick={() => {
                            setViewOpen(true);
                            setScholar(item);
                        }}
                    >
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
                <Button onClick={() => setOpen(true)}>
                    <Plus /> Create Service Period
                </Button>
            </div>
            <Card className="px-6">
                <SearchBar onInput={(e: any) => setSearch(e.target.value)} />
                <DataTable
                    page={page}
                    setPage={setPage}
                    data={data?.data?.scholars}
                    columns={columns}
                    isFetching={isFetching}
                    pagination={data?.data?.pagination}
                />
            </Card>
            <CreateServicePeriod />
            <ViewServicePeriod />
        </>
    );
}

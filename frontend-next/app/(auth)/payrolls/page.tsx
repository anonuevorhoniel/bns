"use client";

import ax from "@/app/axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DataTable from "@/components/custom/datatable";
import SearchBar from "@/components/custom/searchbar";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import ViewPayroll from "./(view)/ViewPayroll";
import { useDebounce } from "use-debounce";
import payrollColumn from "./(columns)/payrollColumn";
import { Plus } from "lucide-react";
import PayrollSummaryPage from "./(summary)/PayrollSummaryPage";

export default function Page() {
    const [search, setSearch] = useState("");
    const [searchDebounce] = useDebounce(search, 500);
    const searchValue = search == "" ? search : searchDebounce;
    const [page, setPage] = useState(1);

    const { data, isFetching } = useQuery({
        queryKey: ["payrolls", page, searchValue],
        queryFn: async () =>
            await ax.post("/payrolls", {
                page: page,
                search: searchValue,
            }),
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    });
    const columns = payrollColumn();

    return (
        <>
            <title>BNS | Payrolls</title>
            <Link href={"/payrolls/create"}>
                <Button>
                    <Plus /> Add Payroll
                </Button>
            </Link>
            <div>
                <Card className="px-6">
                    <SearchBar
                        onInput={(e: any) => setSearch(e.target.value)}
                    />
                    <DataTable
                        page={page}
                        setPage={setPage}
                        columns={columns}
                        data={data?.data?.payrolls}
                        isFetching={isFetching}
                        pagination={data?.data?.pagination}
                    />
                </Card>
            </div>
            <ViewPayroll />
            <PayrollSummaryPage />
        </>
    );
}
